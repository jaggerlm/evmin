package tests.jstrace;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium;

public class TestChrome {
	public static void main1(String[] args) {

//		if(true) return;
		  System.setProperty("webdriver.chrome.driver", "D:\\dev\\chromedriver\\chromedriver.exe");
		  ChromeOptions options = new ChromeOptions();
		  options.addArguments("--proxy-pac-url=http://192.168.137.2:8080/jstrace.pac");
		  DesiredCapabilities capabilities = new DesiredCapabilities();
		  capabilities.setCapability(ChromeOptions.CAPABILITY, options);
		  ChromeDriver driver = new ChromeDriver(capabilities);
		  WebDriverBackedSelenium selenium = new WebDriverBackedSelenium(driver, "http://192.168.137.2:8081");
		  driver.get("http://192.168.137.2/rr_replay?sid=1464657621260&base=1");
		  //showDevToos();
		  
		  WebDriverWait wait = new WebDriverWait(driver, 600);
		  String id = "result_1464657621260";
		  wait.ignoring(NoSuchElementException.class);
		  wait.withMessage("!!!!!!!!!!timeout");
		  wait.until(ExpectedConditions.presenceOfElementLocated(By.id(id)));
		  String res = driver.findElementById(id).getText();
		  System.out.println("=================res:");
		  System.out.println(res);
	}
	 public static void main(String[] args) {

			System.setProperty("webdriver.chrome.driver", 
				"D:\\dev\\chromedriver\\chromedriver.exe");
				
			ChromeOptions options = new ChromeOptions();
			options.addArguments("window-size=1024,768");

			DesiredCapabilities capabilities = DesiredCapabilities.chrome();
			capabilities.setCapability(ChromeOptions.CAPABILITY, options);
			WebDriver driver = new ChromeDriver(capabilities);

			driver.get("http://google.com/");

			if (driver instanceof JavascriptExecutor) {
				((JavascriptExecutor) driver)
					.executeScript("alert('hello world');");
			}
				
		  }
/*
  	private void showDevToos() {
		try{
			Robot robot=new Robot();
			robot.keyPress(KeyEvent.VK_CONTROL);
			robot.keyPress(KeyEvent.VK_SHIFT);
			robot.keyPress(KeyEvent.VK_J);
			robot.keyRelease(KeyEvent.VK_CONTROL);
			robot.keyRelease(KeyEvent.VK_SHIFT);  
			robot.keyRelease(KeyEvent.VK_J);  
		}
		catch(Exception ex){
			System.out.println(ex.getMessage());
		}
	}
*/
}
