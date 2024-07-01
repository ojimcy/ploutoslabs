package main

import (
	"fmt"
	"strconv"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"gorm.io/gorm"
	tb "gopkg.in/tucnak/telebot.v2"
)

func initBot(db *gorm.DB) {
	bot.Handle("/start", respondStartCommand(db))
	bot.Start()
}

func respondStartCommand(db *gorm.DB) func(message *tb.Message) {
	return func(message *tb.Message) {
		uplineStr := message.Payload
		upline, _ := strconv.ParseInt(uplineStr, 10, 64)
		uplineId := uint(upline)
		userData := User{
			TelegramID: message.Sender.ID,
			Username:   message.Sender.Username,
			UplineID:   &uplineId,
		}
		_, err := getUserByTelegramID(db, message.Sender.ID)
		if err == gorm.ErrRecordNotFound {
			if err := createAccount(userData, db); err != nil {
				// log the inability to create account
				fmt.Println(err)
			} else {
				fmt.Println("New account created", userData)
			}
		} else if err != nil {
			fmt.Println(err)
		}
		// Send welcome message to the user
		welcomeMessage := `🎬 Welcome to Ploutos Labs! 🎥

	Join the future of Decentralized finance in a secured and fun-filled way. 
	
	[Launch the app here](https://t.me/ploutos_labs_bot/app).
	
	Dive in and transform your crypto jorney!
	`

		// Create inline keyboard buttons
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
		if _, err := bot.Send(message.Sender, welcomeMessage, tb.ModeMarkdown, inlineKeyboard); err != nil {
			fmt.Println("bot.Send", err)
		}
	}
}

func respondStartCommanda(message *tgbotapi.Message, bot *tgbotapi.BotAPI) {

	reply := `🎬 Welcome to Ploutos Labs! 🎥

	Join the future of Decentralized finance in a secured and fun-filled way. 
	
	[Launch the app here](https://t.me/ploutos_labs_bot/app).
	
	Dive in and transform your crypto jorney!`
	msg := tgbotapi.NewMessage(message.Chat.ID, reply)
	msg.ParseMode = tgbotapi.ModeMarkdown
	bot.Send(msg)
}
