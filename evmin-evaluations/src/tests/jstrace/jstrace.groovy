import java.util.NoSuchElementException;

import org.openqa.selenium.By;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import com.thoughtworks.selenium.Selenium;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;
import java.util.concurrent.TimeUnit;
import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.Assert;

System.setProperty("webdriver.chrome.driver", "D:\\dev\\chromedriver\\chromedriver.exe");
ChromeOptions options = new ChromeOptions();
options.addArguments("--proxy-pac-url=http://192.168.137.2:8080/jstrace.pac");
DesiredCapabilities capabilities = new DesiredCapabilities();
capabilities.setCapability(ChromeOptions.CAPABILITY, options);
ChromeDriver driver = new ChromeDriver(capabilities);
WebDriverBackedSelenium selenium = new WebDriverBackedSelenium(driver, "http://192.168.137.2:8081");

WebDriverWait wait = new WebDriverWait(driver, 600);
wait.ignoring(NoSuchElementException.class);

  
