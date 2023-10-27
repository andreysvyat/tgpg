package ru.svyat.tg;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.api.methods.BotApiMethod;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboard;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.api.objects.webapp.WebAppInfo;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.function.Function;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;
import static java.util.Map.entry;

public class Main {
	private static final Logger LOGGER = LoggerFactory.getLogger(Main.class);
	private static final Properties CONFIGS = readProperties();
	private static final ObjectMapper MAPPER = new ObjectMapper();

	static {
		MAPPER.setSerializationInclusion(NON_NULL);
	}

	private static final Map<String, Function<String, ReplyKeyboard>> keyboards =
			Map.ofEntries(
					entry("inline_web_app", Main::inlineWebPage),
					entry("reply_web_app", Main::replyKeyboard),
					entry("set_fields", Main::setFieldsWebApp)
			);

	public static void main(String[] args) throws TelegramApiException {
		TelegramBotsApi tgApi = new TelegramBotsApi(DefaultBotSession.class);

		TelegramLongPollingBot bot = new TelegramLongPollingBot() {
			@Override
			public String getBotToken() {
				return CONFIGS.getProperty("tg-token");
			}

			@Override
			public String getBotUsername() {
				return CONFIGS.getProperty("tg-name");
			}

			@Override
			public void onUpdateReceived(Update update) {
				try {
					LOGGER.info("update {}", MAPPER.writer().withDefaultPrettyPrinter().writeValueAsString(update));
					processUpdate(update);
				} catch (JsonProcessingException e) {
					LOGGER.error(e.getMessage(), e);
				}
			}

			private void processUpdate(Update update) {
				resolveKb(update)
						.ifPresent(kb -> sneakyExecute(SendMessage.builder()
								.chatId(update.getMessage().getChatId())
								.text(update.getMessage().getText())
								.replyMarkup(kb)
								.build()));
			}

			private <T extends Serializable> void sneakyExecute(BotApiMethod<T> method) {
				try {
					execute(method);
				} catch (TelegramApiException e) {
					throw new RuntimeException(e);
				}
			}
		};
		tgApi.registerBot(bot);
	}

	private static Optional<ReplyKeyboard> resolveKb(Update update) {
		return Optional.ofNullable(update.getMessage())
				.map(Message::getText)
				.map(it -> it.split(" "))
				.map(it -> keyboards.get(it[0]).apply(it[1]));
	}

	private static InlineKeyboardMarkup inlineWebPage(String args) {
		return InlineKeyboardMarkup.builder()
				.keyboardRow(List.of(
						InlineKeyboardButton.builder()
								.text("link")
								.webApp(WebAppInfo.builder()
										.url("https://andreysvyat.github.io/tgpg/pages/index.html?data=some_data")
										.build())
								.build()
				))
				.build();
	}

	private static ReplyKeyboardMarkup replyKeyboard(String args){
		return ReplyKeyboardMarkup.builder()
				.keyboard(List.of(new KeyboardRow(List.of(
						KeyboardButton.builder()
								.text("web_app")
								.webApp(WebAppInfo.builder()
										.url("https://andreysvyat.github.io/tgpg/pages/index.html" + args)
										.build())
								.build()
				))))
				.resizeKeyboard(true)
				.selective(true)
				.build();
	}

	private static ReplyKeyboardMarkup setFieldsWebApp(String args){
		return ReplyKeyboardMarkup.builder()
				.keyboard(List.of(new KeyboardRow(List.of(
						KeyboardButton.builder()
								.text("web_app")
								.webApp(WebAppInfo.builder()
										.url("https://andreysvyat.github.io/tgpg/pages/web_app_setter.html" + args)
										.build())
								.build()
				))))
				.resizeKeyboard(true)
				.selective(true)
				.build();
	}

	private static Properties readProperties() {
		try (var is = Main.class.getClassLoader().getResourceAsStream("local.properties")) {
			Properties properties = new Properties();
			properties.load(is);
			return properties;
		} catch (Exception e) {
			LOGGER.warn(e.getLocalizedMessage(), e);
			throw new RuntimeException(e);
		}
	}
}
