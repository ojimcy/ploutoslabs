package main

import (
	"encoding/base64"
	"fmt"
	"time"

	"github.com/gagliardetto/solana-go"
	"gorm.io/gorm"
)

func createAccount(userData User, db *gorm.DB) error {
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
			// c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
			return err
		}

		if userData.UplineID != nil {
			var upline User
			uplineResult := db.First(&upline, "telegram_id = ?", userData.UplineID)
			if uplineResult.Error == nil {
				upline.ReferralCount += 1
				// upline.Balance += REFERRAL_BONUS
				if err := db.Save(&upline).Error; err != nil {
					fmt.Println(err)
				}
			}
		}
	}

	return nil
}

type User struct {
	ID                 uint       `json:"id" gorm:"primaryKey"`
	TelegramID         int64      `json:"telegramId"`
	Pin                string     `json:"pin"`
	Username           string     `json:"username"`
	PhoneNumber        string     `json:"phoneNumber"`
	MiningRate         float64    `json:"miningRate"`
	MiningFrequency    float64    `json:"miningFrequency"`
	Level              int        `json:"level"`
	LastClaimAt        *time.Time `json:"lastClaimAt"`
	UplineID           *uint      `json:"uplineId"`
	ReferralCount      int64      `json:"referralCount"`
	Balance            float64    `json:"balance"`
	ReferralBonus      float64    `json:"referralBonus"`
	ReferralBonus2     float64    `json:"referralBonus2"`
	SolanaPublicKey    string     `json:"solana_public_key"`
	SolanaPrivateKey   string     `json:"-"`
	SmartWalletAddress string     `json:"smartWalletAddress"`
}

type TokenTransaction struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UserID        uint      `json:"userId"`
	Amount        float64   `json:"amount"`
	TransactionID string    `json:"transactionId"`
	Timestamp     time.Time `json:"timestamp"`
}

type TransactionStatus string

const (
	TRANSACTION_NEW      = TransactionStatus("new")
	TRANSACTION_NOT_SIGN = TransactionStatus("not_sign")
	TRANSACTION_FAILED   = TransactionStatus("failed")
	TRANSACTION_SUCCESS  = TransactionStatus("success")
)

type Transaction struct {
	ID            string            `gorm:"primaryKey" json:"id"`
	Hash          string            `json:"hash"`
	Date          time.Time         `json:"date"`
	UserID        uint              `json:"userId"`
	WalletAddress string            `json:"walletAddress"`
	ToAddress     string            `json:"toAddress"`
	Token         string            `json:"token"`
	TokenDecimals int               `json:"tokenDecimals"`
	Amount        string            `json:"amount"`
	Data          string            `json:"data"`
	Status        TransactionStatus `json:"status"`
}

type Task struct {
	ID          uint    `gorm:"primaryKey" json:"id"`
	Name        string  `json:"name"`
	Link        string  `json:"link"`
	Description string  `json:"description"`
	Reward      float64 `json:"reward"`
	Completed   bool    `json:"completed"`
}

type UserTask struct {
	UserID    uint   `gorm:"primaryKey" json:"userId"`
	TaskID    uint   `gorm:"primaryKey"  json:"taskId"`
	Completed bool   `json:"completed"`
	Proof     string `gorm:"size:1024" json:"proof"`
	Task      Task   `gorm:"foreignKey:TaskID" json:"task"`
}

type Booster struct {
	ID              uint    `gorm:"primaryKey" json:"id"`
	Name            string  `json:"name"`
	Price           float64 `json:"price"`
	Level           int     `json:"level"`
	MiningRate      float64 `json:"miningRate"`
	MiningFrequency float64 `json:"miningFrequency"`
}

func getUserByTelegramID(db *gorm.DB, telegramID int64) (*User, error) {
	var user User
	err := db.Where("telegram_id = ?", telegramID).First(&user).Error

	return &user, err
}

func getTransactionByID(db *gorm.DB, txID string) (*Transaction, error) {
	var tx Transaction
	err := db.Where("id = ?", txID).First(&tx).Error

	return &tx, err
}
