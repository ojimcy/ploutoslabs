package main

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gagliardetto/solana-go"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	tb "gopkg.in/tucnak/telebot.v2"
	"gorm.io/gorm"
)

func handleProfileSync(c *gin.Context, db *gorm.DB, bot *tb.Bot) {
	var userData User

	if err := c.BindJSON(&userData); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user data"})
		return
	}

	// Retrieve the existing user from the database
	var user User
	result := db.First(&user, "telegram_id = ?", userData.TelegramID)

	newWallet := solana.NewWallet()

	privateKeyBase64 := base64.StdEncoding.EncodeToString(newWallet.PrivateKey)

	if result.Error == gorm.ErrRecordNotFound {
		now := time.Now()
		// No existing user, create new
		newUser := User{
			TelegramID:       userData.TelegramID,
			Username:         userData.Username,
			UplineID:         userData.UplineID,
			SolanaPublicKey:  newWallet.PublicKey().String(),
			SolanaPrivateKey: privateKeyBase64,
			LastClaimAt:      &now,
			MiningRate:       0.075,
			MiningFrequency:  2,
			Level:            1,
			Balance:          0,
		}
		if err := db.Create(&newUser).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
			return
		}

		if userData.UplineID != nil {
			var upline User
			uplineResult := db.First(&upline, "telegram_id = ?", userData.UplineID)
			if uplineResult.Error == nil {
				upline.ReferralCount += 1
				if err := db.Save(&upline).Error; err != nil {
					fmt.Println(err)
				}
			}
		}

		// Send welcome message to the user
		welcomeMessage := "🎉 Welcome to Ploutos Labs! 🚀\n\nJoin the future of Decentralized finance in a secured and fun-filled way.\n\n[Start mining PLTL](https://t.me/ploutos_labs_bot/app)\n\nDive in and transform your crypto journey!"

		buttonMineRain := tb.InlineButton{
			Unique: "mineRain",
			Text:   "Mine PLTL",
			URL:    "https://t.me/ploutos_labs_bot/app",
		}
		buttonJoinCommunity := tb.InlineButton{
			Unique: "joinCommunity",
			Text:   "Join Community",
			URL:    "https://t.me/ploutoslabannouncement",
		}

		// Create inline keyboard
		inlineKeyboard := &tb.ReplyMarkup{
			InlineKeyboard: [][]tb.InlineButton{
				{buttonMineRain},
				{buttonJoinCommunity},
			},
		}

		// Send the message with inline keyboard
		if _, err := bot.Send(&tb.User{ID: int64(newUser.ID)}, welcomeMessage, tb.ModeMarkdown, inlineKeyboard); err != nil {
			fmt.Println("bot.Send", err)
		}

		c.JSON(http.StatusOK, gin.H{"message": "User created successfully", "user": newUser})
	} else {
		// Existing user, update
		user.Username = userData.Username
		user.UplineID = userData.UplineID // Update the UplineID
		if err := db.Save(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update user"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "User updated successfully", "user": user})
	}
}

func handleGetProfile(c *gin.Context, db *gorm.DB) {
	userID := c.Param("userID")
	var user User
	result := db.First(&user, "telegram_id = ?", userID)
	if result.Error == gorm.ErrRecordNotFound {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.MiningRate < 0.075 {
		user.MiningRate = 0.075
		db.Save(&user)
	}

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func handleTokenClaim(c *gin.Context, db *gorm.DB) {
	telegramID, _ := strconv.ParseInt(c.Query("telegramId"), 10, 64)

	user, err := getUserByTelegramID(db, telegramID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// Start a transaction
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start database transaction"})
		return
	}

	// Calculate tokens based on mining rate (assuming rate is per hour and max claim window of one hour)
	lastClaimAt := time.Since(*user.LastClaimAt).Milliseconds()
	milliSocondPerHour := user.MiningFrequency * 60 * 60 * 1000
	if lastClaimAt > int64(milliSocondPerHour) {
		lastClaimAt = int64(milliSocondPerHour)
	}
	tokensToClaim := user.MiningRate * (float64(lastClaimAt) / float64(milliSocondPerHour))

	if user.UplineID != nil {
		var upline User

		if err := db.Where("telegram_id = ?", *user.UplineID).First(&upline).Error; err == nil {
			referralBonus := tokensToClaim * 0.08
			upline.ReferralBonus += referralBonus

			// Save upline's updated balance
			if err := tx.Save(&upline).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update upline balance"})
				return
			}

			// Record upline transaction
			uplineTransaction := TokenTransaction{
				UserID:        upline.ID,
				Amount:        referralBonus,
				TransactionID: generateTransactionID(),
				Timestamp:     time.Now(),
			}
			if err := tx.Create(&uplineTransaction).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record upline transaction"})
				return
			}

			var l2Upline User
			if upline.UplineID != nil {
				if err := db.Where("telegram_id = ?", upline.UplineID).First(&l2Upline).Error; err == nil {
					referralBonus := tokensToClaim * 0.02
					l2Upline.ReferralBonus2 += referralBonus

					// Save l2Upline's updated balance
					if err := tx.Save(&l2Upline).Error; err != nil {
						tx.Rollback()
						c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update l2Upline balance"})
						return
					}

					// Record upline transaction
					uplineTransaction := TokenTransaction{
						UserID:        l2Upline.ID,
						Amount:        referralBonus,
						TransactionID: generateTransactionID(),
						Timestamp:     time.Now(),
					}
					if err := tx.Create(&uplineTransaction).Error; err != nil {
						tx.Rollback()
						c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record upline transaction"})
						return
					}
				}
			}
		}
	}

	// Update the user's last claim time and balance
	now := time.Now()
	user.LastClaimAt = &now
	user.Balance += tokensToClaim
	if err := tx.Save(&user).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user record"})
		return
	}

	// Record the user's transaction
	userTransaction := TokenTransaction{
		UserID:        user.ID,
		Amount:        tokensToClaim,
		TransactionID: generateTransactionID(),
		Timestamp:     now,
	}
	if err := tx.Create(&userTransaction).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record user transaction"})
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tokens claimed successfully", "amount": tokensToClaim})
}

func handleClaimRefBonus(c *gin.Context, db *gorm.DB) {
	telegramID := c.Query("telegramId")

	var user User
	if err := db.Where("telegram_id = ?", telegramID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	user.Balance += user.ReferralBonus
	user.Balance += user.ReferralBonus2
	user.ReferralBonus = 0
	user.ReferralBonus2 = 0

	db.Save(&user)
	c.JSON(http.StatusOK, user)
}

func generateTransactionID() string {
	return strconv.FormatInt(time.Now().UnixMilli(), 10)
}

func handleWalletOverview(c *gin.Context, db *gorm.DB) {
	// Implementation of wallet overview retrieval
}

func handleClaimStatus(c *gin.Context, db *gorm.DB) {
	telegramID := c.Param("telegramId") // Assume Telegram ID is passed as a URL parameter
	var user User
	if err := db.Where("telegram_id = ?", telegramID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// Calculate the time since the last claim
	if user.LastClaimAt == nil {
		c.JSON(http.StatusOK, gin.H{"eligible": true, "message": "You can claim tokens now."})
		return
	}

	timeSinceLastClaim := time.Since(*user.LastClaimAt)
	if timeSinceLastClaim.Hours() >= 6 {
		c.JSON(http.StatusOK, gin.H{"eligible": true, "message": "You can claim tokens now."})
	} else {
		// Calculate remaining time until next claim
		remainingTime := 6*time.Hour - timeSinceLastClaim
		c.JSON(http.StatusOK, gin.H{
			"eligible": false,
			"message":  "You need to wait more time before claiming again.",
			"waitTime": remainingTime.String(),
		})
	}
}

func handleCreateWallet(c *gin.Context, db *gorm.DB) {
	// Generate a new wallet (keypair)
	newWallet := solana.NewWallet()

	// For the sake of security, DO NOT send the private key to the client.
	publicKey := newWallet.PublicKey()

	telegramID := c.Param("telegramId") // Assume Telegram ID is passed as a URL parameter
	var user User
	if err := db.Where("telegram_id = ?", telegramID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	privateKeyBase64 := base64.StdEncoding.EncodeToString(newWallet.PrivateKey)

	user.SolanaPublicKey = newWallet.PublicKey().String()
	user.SolanaPrivateKey = privateKeyBase64

	if err := db.Save(user).Error; err != nil {
		fmt.Printf("database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"publicKey": publicKey.String(),
	})
}

func handleGetSolanaPrivateKey(c *gin.Context, db *gorm.DB) {
	telegramID := c.Param("telegramId") // Assume Telegram ID is passed as a URL parameter
	var user User
	if err := db.Where("telegram_id = ?", telegramID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"privateKey": user.SolanaPrivateKey, "publicKey": user.SolanaPublicKey})
}

func listTasks(c *gin.Context, db *gorm.DB) {
	var tasks []Task
	if err := db.Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

func listUserTasks(c *gin.Context, db *gorm.DB) {
	userID := c.Param("userID")

	// Fetch all tasks
	var tasks []Task
	if err := db.Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
		return
	}

	// Fetch completed tasks for the user
	var completedTasks []UserTask
	if err := db.Where("user_id = ? AND completed = true", userID).Find(&completedTasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user tasks"})
		return
	}

	// Mark completed tasks
	for i, task := range tasks {
		for _, userTask := range completedTasks {
			if userTask.TaskID == task.ID {
				tasks[i].Completed = true
				break
			}
		}
	}

	c.JSON(http.StatusOK, tasks)
}

func listUserTaskas(c *gin.Context, db *gorm.DB) {
	userID := c.Param("userID")
	var userTasks []UserTask
	if err := db.Preload("Task").Where("user_id = ? AND completed = true", userID).Find(&userTasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user tasks"})
		return
	}
	c.JSON(http.StatusOK, userTasks)
}

func completeTask(c *gin.Context, db *gorm.DB) {
	userID := c.Param("userID")
	taskID := c.Param("taskID")
	var input struct {
		Proof string `json:"proof"` // Receive proof from the request body
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Start a transaction for atomic operations
	tx := db.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start database transaction"})
		return
	}

	var user User
	if err := tx.Where("id = ?", userID).First(&user).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var task Task
	if err := tx.Where("id = ?", taskID).First(&task).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	// Check if task is already completed
	var userTask UserTask
	if err := tx.Where("user_id = ? AND task_id = ?", userID, taskID).First(&userTask).Error; err == nil && userTask.Completed {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Task already completed"})
		return
	}

	// Mark the task as completed and update user balance
	userTask = UserTask{
		UserID:    user.ID,
		TaskID:    task.ID,
		Completed: true,
		Proof:     input.Proof,
	}
	if err := tx.Create(&userTask).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark task as completed"})
		return
	}

	user.Balance += task.Reward
	if err := tx.Save(&user).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user balance"})
		return
	}

	// Record the user's transaction
	userTransaction := TokenTransaction{
		UserID:        user.ID,
		Amount:        task.Reward,
		TransactionID: generateTransactionID(),
		Timestamp:     time.Now(),
	}
	if err := tx.Create(&userTransaction).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record user transaction"})
		return
	}

	// Credit the upline with 10% of the tokens earned by the user if an upline exists
	if user.UplineID != nil {
		var upline User
		if err := tx.Where("id = ?", user.UplineID).First(&upline).Error; err == nil {
			referralBonus := task.Reward * 0.1
			upline.Balance += referralBonus

			if err := tx.Save(&upline).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update upline balance"})
				return
			}

			// Record the upline transaction
			uplineTransaction := TokenTransaction{
				UserID:        *user.UplineID,
				Amount:        referralBonus,
				TransactionID: generateTransactionID(),
				Timestamp:     time.Now(),
			}
			if err := tx.Create(&uplineTransaction).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record upline transaction"})
				return
			}
		}
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task completed successfully", "balanceUpdated": user.Balance})
}

func getBoosters(c *gin.Context, db *gorm.DB) {
	var boosters []Booster
	if err := db.Find(&boosters).Order("level").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch booster"})
		return
	}
	c.JSON(http.StatusOK, boosters)
}

type bootInput struct {
	TelegramID int64 `json:"telegramId"`
	BoosterId  int   `json:"boosterId"`
}

func boostAccount(c *gin.Context, db *gorm.DB) {
	var input bootInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Start a transaction for atomic operations
	tx := db.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start database transaction"})
		return
	}

	var user User
	if err := tx.Where("telegram_id = ?", input.TelegramID).First(&user).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var booster Booster
	if err := tx.Where("id = ?", input.BoosterId).First(&booster).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Booster not found"})
		return
	}

	if booster.Price > user.Balance {
		tx.Rollback()
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient balance"})
		return
	}

	if user.Level >= booster.Level {
		fmt.Println(user.Level, booster.Level)
		tx.Rollback()
		c.JSON(http.StatusForbidden, gin.H{"error": "You cannot boost to this level"})
		return
	}

	user.Balance -= booster.Price
	user.MiningFrequency = booster.MiningFrequency
	user.MiningRate = booster.MiningRate
	user.Level = booster.Level

	if err := tx.Save(&user).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Account boosted"})
}

type SyncAddressInput struct {
	Address string `json:"address"`
}

func setSmartWalletAddress(c *gin.Context, db *gorm.DB) {
	var userData SyncAddressInput

	if err := c.BindJSON(&userData); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user data"})
		return
	}

	userID := c.Param("userID")
	var user User
	result := db.First(&user, "telegram_id = ?", userID)
	if result.Error == gorm.ErrRecordNotFound {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.SmartWalletAddress = userData.Address

	db.Save(&user)
	c.JSON(http.StatusOK, user)
}

func initWalletTranssaction(c *gin.Context, db *gorm.DB) {
	var input Transaction
	if err := c.BindJSON(&input); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tx data"})
		return
	}

	currentUser, err := getCurrentUser(c, db)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	input.UserID = currentUser.ID

	uuidWithHyphen := uuid.New()
	fmt.Println(uuidWithHyphen)
	input.ID = strings.Replace(uuidWithHyphen.String(), "-", "", -1)

	if err := db.Save(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to init transaction"})
		return
	}

	c.JSON(http.StatusOK, input)
}

func updateWalletTranssaction(c *gin.Context, db *gorm.DB) {
	var input Transaction
	if err := c.BindJSON(&input); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tx data"})
		return
	}

	tx, err := getTransactionByID(db, input.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	tx.Status = input.Status
	tx.Hash = input.Hash

	if err := db.Save(&tx).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to init transaction"})
		return
	}

	c.JSON(http.StatusOK, input)
}

func getTransactionDetails(c *gin.Context, db *gorm.DB) {
	txID := c.Query("txID")
	tx, err := getTransactionByID(db, txID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not Found"})
		return
	}

	c.JSON(http.StatusOK, tx)
}
