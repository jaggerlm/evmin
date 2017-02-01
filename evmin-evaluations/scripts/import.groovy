import com.thoughtworks.selenium.Selenium;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.By;
import java.util.concurrent.TimeUnit;
import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.Assert;
import org.openqa.selenium.Proxy;
import org.openqa.selenium.remote.DesiredCapabilities;

System.setProperty("webdriver.chrome.driver", "D:\\dev\\chromedriver\\chromedriver.exe");
WebDriver driver = new ChromeDriver();
if (isWebDriver) {
	driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
}
else
	selenium = new WebDriverBackedSelenium(driver, "http://www.baidu.com");




