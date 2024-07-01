package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	tb "gopkg.in/tucnak/telebot.v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var bot *tb.Bot

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	router := gin.Default()

	// Configure CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{
		"http://localhost:3000",
		"https://mining-app-695gjgh4f.ploutoslabs.io",
		"https://glowing-jennet-crucial.ngrok-free.app",
		"https://ploutos-mining.netlify.app",
		"https://keys.ploutoslabs.io",
	}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept"}
	router.Use(cors.New(config))

	// Set up the database connection string
	dsn := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=%s password=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_SSLMODE"),
		os.Getenv("DB_PASSWORD"))
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate to create tables based on model definitions
	db.AutoMigrate(&User{}, &TokenTransaction{}, &Task{}, &UserTask{}, &Booster{}, &Transaction{})

	if err := initData(db); err != nil {
		log.Panic(err)
		return
	}

	// Telegram Bot Setup
	if os.Getenv("NO_BOOT") != "1" {
		bot, err = tb.NewBot(tb.Settings{
			// You can also set custom API URL.
			// If field is empty it equals to "https://api.telegram.org".
			// URL: "http://195.129.111.17:8012",
			URL: "https://api.telegram.org",

			Token:  os.Getenv("TELEGRAM_KEY"),
			Poller: &tb.LongPoller{Timeout: 10 * time.Second},
		})

		if err != nil {
			panic(err)
		}

		fmt.Println("bot name: ", bot.Me.Username)

		go initBot(db)
	}

	// Define API endpoints
	defineRoutes(router, db, bot)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	// Start serving the application
	router.Run(":" + port)
}

func defineRoutes(router *gin.Engine, db *gorm.DB, bot *tb.Bot) {
	router.POST("/claim-token", func(c *gin.Context) { handleTokenClaim(c, db) })
	router.POST("/claim-token-ref-bonus", func(c *gin.Context) { handleClaimRefBonus(c, db) })
	router.GET("/wallet-overview", func(c *gin.Context) { handleWalletOverview(c, db) })
	router.POST("/sync-profile", func(c *gin.Context) { handleProfileSync(c, db, bot) })
	router.GET("/claim-status", func(c *gin.Context) { handleClaimStatus(c, db) })
	router.POST("/create-solana-wallet", func(c *gin.Context) { handleCreateWallet(c, db) })
	router.GET("/get-solana-wallet-pk", func(c *gin.Context) { handleGetSolanaPrivateKey(c, db) })
	router.GET("/tasks", func(c *gin.Context) { listTasks(c, db) })
	router.GET("/user/:userID", func(c *gin.Context) { handleGetProfile(c, db) })
	router.GET("/user/:userID/tasks", func(c *gin.Context) { listUserTasks(c, db) })
	router.POST("/user/:userID/complete-task/:taskID", func(c *gin.Context) { completeTask(c, db) })
	router.GET("/boosters", func(c *gin.Context) { getBoosters(c, db) })
	router.POST("/boost", func(c *gin.Context) { boostAccount(c, db) })

	router.POST("/user/:userID/set-smart-address", func(c *gin.Context) { setSmartWalletAddress(c, db) })
	router.POST("/init-transaction", func(c *gin.Context) { initWalletTranssaction(c, db) })
	router.POST("/update-transaction", func(c *gin.Context) { updateWalletTranssaction(c, db) })
	router.GET("/get-transaction-details", func (c *gin.Context)  {
		getTransactionDetails(c, db)
	})
}

func initData(db *gorm.DB) error {
	tasks := []Task{
		{
			Name: "Join Telegram", Description: "Join our Telegram group", Reward: 0.2, Link: "https://t.me/ploutoslab",
		},
		{
			Name: "Telegram Channel", Description: "Join our Telegram group", Reward: 0.2, Link: "https://t.me/ploutoslabannouncement",
		},
		{
			Name: "Follow on Twitter", Description: "Follow us on Twitter", Reward: 0.2, Link: "https://twitter.com/ploutoslabs",
		},
	}

	tx := db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	for _, task := range tasks {
		var oldTask Task
		if err := tx.First(&oldTask, "name = ?", task.Name).Error; err == gorm.ErrRecordNotFound {
			if err := tx.Create(&task).Error; err != nil {
				tx.Rollback()
				return err
			}
			log.Println("init", task, err)
		} else {
			fmt.Println("oldTask - ", oldTask)
		}
	}

	boosters := []Booster{
		{Name: "PLABS L1", Level: 2, Price: 2, MiningRate: 0.04, MiningFrequency: 4},
		{Name: "PLABS L2", Level: 3, Price: 4, MiningRate: 0.1, MiningFrequency: 12},
	}

	for _, b := range boosters {
		var oldBooster Booster
		if err := tx.First(&oldBooster, "name = ?", b.Name).Error; err == gorm.ErrRecordNotFound {
			if err := tx.Create(&b).Error; err != nil {
				tx.Rollback()
				return err
			}
			log.Println("init", b, err)
		} else {
			log.Println("b - ", b)
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return err
	}

	return nil
}
