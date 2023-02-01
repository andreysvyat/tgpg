package ru.svyat.tg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.api.methods.AnswerCallbackQuery;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.api.objects.webapp.WebAppInfo;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

import java.util.List;

public class Main {
	private static final Logger LOGGER = LoggerFactory.getLogger(Main.class);

	public static void main(String[] args) throws TelegramApiException {
		TelegramBotsApi tgApi = new TelegramBotsApi(DefaultBotSession.class);
		TelegramLongPollingBot bot = new TelegramLongPollingBot() {
			@Override
			public String getBotToken() {
				return "6079010690:AAF0S-Nk6RPVmWWXkH0f4r53bpYfroX4sug";
			}

			@Override
			public void onUpdateReceived(Update update) {
				try {
					LOGGER.info("update {}", update);
					if (update.hasMessage()) {
						String text = "hi";
						if (update.getMessage().getWebAppData() != null) {
							LOGGER.info(update.getMessage().getWebAppData().getData());
							text = update.getMessage().getWebAppData().getData();
						}
						execute(SendMessage.builder()
								.chatId(update.getMessage().getChatId())
								.text(text)
								.replyMarkup(replyKb())
								.build());
					}
					if (update.hasCallbackQuery()) {
						execute(AnswerCallbackQuery.builder()
								.text("cba")
								.callbackQueryId(update.getCallbackQuery().getId())
								.showAlert(true)
								.build());
					}
				} catch (TelegramApiException e) {
					LOGGER.error(e.getMessage(), e);
				}
			}

			@Override
			public String getBotUsername() {
				return "mfa_clubs_test_bot";
			}
		};
		tgApi.registerBot(bot);
	}

	private static ReplyKeyboardMarkup replyKb() {
		return ReplyKeyboardMarkup.builder()
				.keyboard(
						List.of(new KeyboardRow(
								List.of(KeyboardButton.builder()
										.text("app")
										.webApp(WebAppInfo.builder()
												.url("https://andreysvyat.github.io/tppg/index.html")
												.build())

										.build())
						))).build();
	}
	private static InlineKeyboardMarkup inlineKb(){
		return InlineKeyboardMarkup.builder()
				.keyboardRow(List.of(InlineKeyboardButton.builder()
								.text("app")
								.webApp(WebAppInfo.builder()
										.url("https://andreysvyat.github.io/tppg/index.html")
										.build())
						.build()))
				.build();
	}
}
