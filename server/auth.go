package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"gorm.io/gorm"
)

func VerifyTelegramData() gin.HandlerFunc {
	return func(c *gin.Context) {
		telegramInitData := c.GetHeader("TelegramInitData")
		// fmt.Println("TelegramInitData", telegramInitData)
		if telegramInitData == "" {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "telegramInitData header is missing"})
			return
		}

		if !verifyInitData(telegramInitData) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid telegramInitData"})
			return
		}

		c.Next()
	}
}

var botToken string

func getBotToken() string {
	if botToken == "" {
		botToken = os.Getenv("TELEGRAM_TOKEN")
	}

	if botToken == "" {
		panic("BOT_TOKEN is not set in environment variables")
	}

	return botToken
}

func verifyInitData(telegramInitData string) bool {
	urlParams, _ := url.ParseQuery(telegramInitData)
	hash := urlParams.Get("hash")
	urlParams.Del("hash")

	// Sort the parameters by key
	keys := make([]string, 0, len(urlParams))
	for key := range urlParams {
		// fmt.Println(key, urlParams.Get(key))
		keys = append(keys, key)
	}

	// // date validation
	if os.Getenv("ENV") != "local" {
		dateUnix, _ := strconv.ParseInt(urlParams.Get("auth_date"), 10, 64)
		if time.Since(time.Unix(dateUnix, 0)).Seconds() > 300 {
			return false
		}
	}
	sort.Strings(keys)

	// Build the data check string
	var dataCheckString strings.Builder
	for _, key := range keys {
		dataCheckString.WriteString(key + "=" + urlParams.Get(key) + "\n")
	}
	dataCheckStringStr := dataCheckString.String()
	dataCheckStringStr = dataCheckStringStr[:len(dataCheckStringStr)-1] // Remove the last newline

	// Create HMAC using the BOT_TOKEN as the secret
	secretKey := hmac.New(sha256.New, []byte("WebAppData"))
	secretKey.Write([]byte(getBotToken()))
	secret := secretKey.Sum(nil)

	hmacHash := hmac.New(sha256.New, secret)
	hmacHash.Write([]byte(dataCheckStringStr))
	calculatedHash := hex.EncodeToString(hmacHash.Sum(nil))

	return calculatedHash == hash
}

func getCurrentTelegramUser(c *gin.Context) (user tgbotapi.User) {
	urlParams, _ := url.ParseQuery(c.GetHeader("TelegramInitData"))
	userString := urlParams.Get("user")
	json.Unmarshal([]byte(userString), &user)
	return
}

func getCurrentUser(c *gin.Context, db *gorm.DB) (*User, error) {
	telegramUser := getCurrentTelegramUser(c)
	return getUserByTelegramID(db, telegramUser.ID)
}
