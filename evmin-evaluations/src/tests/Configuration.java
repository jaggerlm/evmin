package tests;

import java.util.ArrayList;

import tests.jstrace.TraceInfo;

public class Configuration {
	public static final String DELTADEBUGGING_SERVER = "192.168.137.1";
	
//	public static final String DEV_CHROMEDRIVER_PATH = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
	public static final String DEV_CHROMEDRIVER_PATH = "D:\\dev\\chromedriver\\chromedriver.exe";

	public static final String JSTRACE_SERVER = "192.168.137.2";
	public static final String PROXY_JSTRACE_REPLAY_PAC = "--proxy-pac-url=http://"+JSTRACE_SERVER+":8080/8002.pac";
	public static final String PROXY_JSTRACE_WEAK_PAC = "--proxy-pac-url=http://"+JSTRACE_SERVER+":8080/8502.pac";
	public static final String JSTRACE_replayBaseUrl = "http://"+JSTRACE_SERVER+":8081";
	
	public static String JSTRACE_LOG_SERVER = "http://"+JSTRACE_SERVER+":8080/service/log";
	public static String JATRACE_REPLAY_SERVER = "http://"+JSTRACE_SERVER+"/rr_replay";
	public static String JSTRACE_FILE_SERVICE = "http://"+JSTRACE_SERVER+":8080/service/file";
	public static String JSTRACE_STEP1_SERVICE = "http://"+JSTRACE_SERVER+":8080/ui/jsmin-step1";
	
	public static String POLICY_DELTA = "DELTA";
	public static String POLICY_WEAK = "WEAK";
	
	public static int TIMEOUT_EACH_EXECUTION = 3600;
	
	static ArrayList<String> seleniumRecordings = new ArrayList<String>(){
		{
			add("experiment/tests/CanadaLong.txt");
//			add("experiment/tests/OnlineShoppingLong.txt");
//			add("experiment/tests/AgeLong.txt");
//			add("experiment/tests/CarRental.txt");
//			add("experiment/tests/InsuranceLong.txt");
			
//			add("experiment/tests/23.txt"); //StudentInfo
//			add("experiment/tests/25.txt"); //Airport
//			add("experiment/tests/26.txt"); //BestCars
//			add("experiment/tests/27.txt"); //game
//			add("experiment/tests/28.txt"); //Numbers
				
			/*not used traces*/
//			add("experiment/tests/29.txt");
//			add("experiment/tests/30.txt");
				
			/*filter out traces that cannot be reproduced*/
//			add("experiment/tests/CatLong.txt");
//			add("experiment/tests/18-Appointment.txt");
//			add("experiment/tests/AccountLong.txt");
//			add("experiment/tests/TestNumber.txt");
//			add("experiment/tests/DentistLong.txt");
//			add("experiment/tests/Financial.txt");
//			add("experiment/tests/TravellersLong.txt");
//			add("experiment/tests/order.txt");
//			add("experiment/tests/Phone.txt");
//			add("experiment/tests/Pool.txt");	
			
			/*filter out traces if its reduced length is no more than 1*/	
//			add("experiment/tests/WaitingList.txt");
//			add("experiment/tests/24.txt");
//			add("experiment/tests/Birthday.txt");
//			add("experiment/tests/Passport.txt");
//			add("experiment/tests/ReorderLong.txt");
//			add("experiment/tests/Cook.txt");
//			add("experiment/tests/MyCart.txt");
//			add("experiment/tests/Flower.txt");
		}
	};
	
	static ArrayList<TraceInfo> jsTraceRecordings = new ArrayList<TraceInfo>(){
		{
//			add(new TraceInfo("1464657621260", new Integer[] {132,443,818,970,1051}));
//			add(new TraceInfo("1464933703078", new Integer[] {451,807,1043,1145,1189}));
//			add(new TraceInfo("1430793897214", new Integer[] {148,338}));
//			add(new TraceInfo("1432604567665", new Integer[] {199,294,395}));
//			add(new TraceInfo("1456407830011", new Integer[] {1556,1562}));
//			add(new TraceInfo("1456465391339", new Integer[] {246,251,255,609,611,613}));
			
			/* Special cases:
			 * 1. need manual help collecting info,
			 * because some event need more time to load(by ajax) or render UI
			 * Lucky, JsTrace provide DEBUG mode to schedule event (in console tab of Chrome-dev-tool, run R$.command.help() for help)
			 * 2. ignore "this.invokeFun" function in JsTrace source file src/js/analyses2/WeakAnalysis.js
			 * the implementation of symbolizing is not complete yet and may introduce new error.
			 */
			// 1. visit http://192.168.137.2/rr_replay?sid=1471836191598&reduce=true&base=1&policy=WEAK&mode=STEP
			// open the developer console
			// run "R$.command.timing.begin()" and "R$.command.timing.begin()" before and after the following part
			// wait until the editor is loaded, 
			// run "R$.command.debug.execute()"
//			add(new TraceInfo("1471836191598", new Integer[] {412,1322}));
			
			
			//TODO
			//add(new TraceInfo("1432816837035", new Integer[] {584,1309,1395}));
			//add(new TraceInfo("1425276010802", new Integer[] {211,214,273,276,359,360,495,497,684,689,690}));
			add(new TraceInfo("1471844959272", new Integer[] {1083,1087,1093,1095,1105,1278,1286}));
			//[374, 688, 952, 953, 955, 1079, 1080, 1081, 1082, 1083, 1087, 1093, 1095, 1099, 1105, 1183, 1184, 1276, 1277, 1278, 1286]	
		}
	};
	
	static ArrayList<TraceInfo> deltaDebuggingMotivationExample = new ArrayList<TraceInfo>(){
		{
			add(new TraceInfo("test1", 30, new Integer[] {1,2,3,14,15,16,17,27,28,29,30}));
			
				
		}
	};
}
