package tests.jstrace;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import tests.Configuration;

import com.thoughtworks.selenium.SeleniumException;
import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium;

import edu.unl.webtesting.AssertHelper;
import edu.unl.webtesting.Main;
import groovy.lang.Binding;
import groovy.lang.GroovyShell;

public class JSTraceAdapter extends Main {
	HashMap<String, TraceInfo> tests = new HashMap();
	GroovyShell shell;
	String logFile;
	Binding binding;
	AssertHelper assertHelper;
	String pacfile;
	private WebDriverWait wait;

	private WebDriverBackedSelenium selenium;

	private ChromeDriver driver;
	private boolean browserOff = false;

	// private String clearDBUrl = "";
	public JSTraceAdapter() {
		URL[] urls = new URL[] {};
		ClassLoader loader = new URLClassLoader(urls, Thread.currentThread()
				.getContextClassLoader());
		this.binding = new Binding();
		this.shell = new GroovyShell(loader, binding);
	}

	public JSTraceAdapter(String pacfile, boolean startServer) {
		this();
		this.pacfile = pacfile;
		if(startServer)
			StaticWebServer.start("experiment/code");
	}

	public void init() {
		if(this.browserOff)
			return;
		try {
			System.setProperty("webdriver.chrome.driver",Configuration.DEV_CHROMEDRIVER_PATH);
			ChromeOptions options = new ChromeOptions();
			options.addArguments(this.pacfile);
			DesiredCapabilities capabilities = new DesiredCapabilities();
			capabilities.setCapability(ChromeOptions.CAPABILITY, options);
			driver = new ChromeDriver(capabilities);
			selenium = new WebDriverBackedSelenium(driver,
					Configuration.JSTRACE_replayBaseUrl);
			binding.setVariable("selenium", selenium);
			assertHelper = new AssertHelper();
			binding.setVariable("assertHelper", assertHelper);
			wait = new WebDriverWait(driver, 600);
			wait.ignoring(NoSuchElementException.class);
			
						
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void open(String url) {
		selenium.deleteAllVisibleCookies();
		selenium.open(url);
		selenium.waitForPageToLoad("30000");
	}

	@Override
	public void stop() {
		selenium.stop();
	}

	// apply jstrace to delta-debugging
	public void deltaDebugging(TraceInfo jsTraceInfo) throws IOException {
		this.logFile = "./experiment/results/dd_"+jsTraceInfo.sid+"_"+new SimpleDateFormat("yyyy.MM.dd HH'h' mm'm' ss's'").format(new Date());
		tests.put(jsTraceInfo.sid, jsTraceInfo);
		String traceURL = jsTraceInfo.traceURL();
		File traceFile = new File("./experiment/jstrace",
				jsTraceInfo.sid+".log");
		FileUtils.copyURLToFile(new URL(traceURL), traceFile);
		String[] lines = FileUtils.readFileToString(traceFile).split(";;;");
		ArrayList<String> events = new ArrayList<String>(Arrays.asList(lines));
		events.remove(events.size() - 1);
		deltaDebugging(jsTraceInfo, null, events);
	}

	private void deltaDebugging(TraceInfo trace,
			ArrayList<String> prefixEvents, ArrayList<String> events) {
		long time = System.currentTimeMillis();
		DDSearch ddSearch = new DDSearch(this, trace.sid,
				prefixEvents, events);
		List<Integer> minTest = (List<Integer>) ddSearch.ddmin();
		info(String.format("Delta Debugging time: %s seconds",
				String.valueOf((System.currentTimeMillis() - time) / 1000.0)));
		info(String
				.format("Total Test: %d[%d] (Pass: %d[%d], Fail: %d[%d], Unresolved: %d[%d])",
						ddSearch.getTotalTest(), ddSearch.getTotalCachedTest(),
						ddSearch.getTotalPass(), ddSearch.getTotalCachedPass(),
						ddSearch.getTotalFail(), ddSearch.getTotalCachedFail(),
						ddSearch.getTotalUnresolved(),
						ddSearch.getTotalCachedUnresolved()));
		info(String.format("Reduced events: %s (size: %d/%d)", minTest,
				minTest.size(), events.size()));
	}
	public void getDeltaDebuggingSubtraces(TraceInfo trace){
		this.setBrowerOff(true);
		this.tests.put(trace.sid, trace);
		ArrayList<String> events = new ArrayList();
		for(int i=1;i<=trace.traceLength;i++)
			events.add(i+"");
		this.deltaDebugging(trace,null,events);
	}
	public void setLogFile(String logFile){
		this.logFile = logFile; 
	}
	public void executeEvents(TraceInfo jsTraceInfo, List<Integer> subList) {
		tests.put(jsTraceInfo.sid, jsTraceInfo);
		executeEvents(jsTraceInfo.sid, null, null, subList, true);
	}
	public JSTraceAdapter setBrowerOff(boolean isOff){
		this.browserOff  = isOff;
		return this;
	}
	int count = 0;
	public int executeEvents(String sid, ArrayList<String> prefixEvents,
			ArrayList<String> events, List<Integer> subList,
			boolean skipAssertion) {
		// requestHTTP(this.clearDBUrl);
		TraceInfo trace = tests.get(sid);
		String url = trace.replayURL(subList);
		info("[" + count++ + "] openning url:" + url);
		if(!this.browserOff){
			driver.get(url);
			wait.withMessage("Replaying timeout with sid=" + trace.sid);
			wait.until(ExpectedConditions.presenceOfElementLocated(By
					.id("result_" + trace.sid)));
			String timeCost = driver.findElementByCssSelector(
					"#result_" + trace.sid + " #time").getText();
			String length = driver.findElementByCssSelector(
					"#result_" + trace.sid + " #length").getText();
			
			info("Time Cost:"+timeCost);
			info("Trace Length:"+length);
			trace.extra.put("time",timeCost);
		}
		return trace.test(subList);
	}

	public void info(String msg) {
		System.out.println(msg);

		if (logFile == null)
			return;
		try {
			PrintWriter pw = new PrintWriter(new FileWriter(new File(logFile),
					true), true);
			pw.println(msg);
			pw.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private ArrayList<String> extractPrefixEvents(ArrayList<String> events) {
		ArrayList<String> prefixEvents = new ArrayList<String>();
		while (!events.isEmpty()) {
			String firstLine = events.get(0);
			if (firstLine.trim().startsWith("@")) {
				prefixEvents.add(events.remove(0).trim().substring(1));
			} else {
				break;
			}
		}
		return prefixEvents;
	}

	@SuppressWarnings("deprecation")
	public void jstracing(String seleniumTestCasePath) throws IOException {
		List<String> lines = Files.readAllLines(FileSystems.getDefault()
				.getPath(seleniumTestCasePath), StandardCharsets.UTF_8);
		// get url from the first line
		String url = lines.get(0);
		url = url.replace("localhost", Configuration.DELTADEBUGGING_SERVER);
		info(String.format("# url: %s", url));

		lines.remove(0);

		// format event texts to be used in Groovy script engine.
		ArrayList<String> events = new ArrayList<String>();
		for (String line : lines) {
			line = line
					.replaceAll("\\(\"", "('''")
					.replaceAll("\",", "''',")
					.replaceAll("\" ,", "''' ,")
					.replaceAll(", \"", ", '''")
					.replaceAll(",\"", ",'''")
					.replaceAll("\"\\)", "''')")
					.replaceAll("assertEquals\\(", "assertHelper.assertEquals(")
					.replaceAll("assertNotEquals\\(",
							"assertHelper.assertNotEquals(")
					.replaceAll("assertTrue\\(", "assertHelper.assertTrue(")
					.replaceAll("assertFalse\\(", "assertHelper.assertFalse(")
					.trim();
			if (!line.equals(""))
				events.add(line);
		}

		ArrayList<String> prefixEvents = extractPrefixEvents(events);

		info(String.format("There are %d events (with %d prefix events)",
				events.size(), prefixEvents.size()));

		open(url);

		for (String event : prefixEvents) {
			try{
				shell.evaluate(event);
			}catch(Exception e){
				System.out.println("Error: executing prefix events");
			}
		}

		for (int i = 0; i < events.size(); i++) {
			try{
				System.out.println("Event"+i+":"+events.get(i));
				selenium.runScript("R$.mockEvent({id:"+(i+1)+"})");
				shell.evaluate(events.get(i));
				//driver.executeScript("confirm('mockevent:"+(i+1)+"');");
			}catch (SeleniumException e) {
				 e.printStackTrace();
			} catch (Exception e) {
				System.out.println("Failure is reproduced");
			}
		}
		driver.executeScript("alert('hello world');");
	}


}
