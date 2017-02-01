package tests;

import java.io.File;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.Test;

import tests.jstrace.JSTraceAdapter;
import tests.jstrace.TraceInfo;

import com.google.gson.Gson;

public class runTests {
	//@Test
	public void deltadebuggingWithSeleniumRecordings(){
		edu.unl.webtesting.Main experiment = new edu.unl.webtesting.Main();
	    try {
	    	experiment.init();
	    	for(int i=0;i<Configuration.seleniumRecordings.size();i++){
	    		experiment.run(Configuration.seleniumRecordings.get(i));
	    	}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	//@Test
	//Currently manually inspected, since the examples are simple
	//TODO: provide the assertions to slice from
/*	public void weakAnalysisWithSeleniumRecordings() {
		JSTraceAdapter experiment = new JSTraceAdapter(
				Configuration.PROXY_JSTRACE_MINIZE_PAC, true);
		try {
			experiment.init();
	    	for(int i=0;i<Configuration.seleniumRecordings.size();i++){
	    		experiment.jstracing(Configuration.seleniumRecordings.get(i));
	    	}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			experiment.stop();
		}
	}*/

	//step1: information collecting
	void weakAnalysisStep1(){
		JSTraceAdapter experiment = new JSTraceAdapter(
				Configuration.PROXY_JSTRACE_WEAK_PAC, false);
		try {
			experiment.init();
			for(int i=0;i<Configuration.jsTraceRecordings.size();i++){
				TraceInfo jsTraceInfo = Configuration.jsTraceRecordings.get(i);
				System.out.println("Collecting information begin for ID:"+jsTraceInfo.sid);
				jsTraceInfo.policy(Configuration.POLICY_WEAK);
				experiment.setLogFile(jsTraceInfo.logFile());
				experiment.executeEvents(jsTraceInfo, Collections.EMPTY_LIST);
				System.out.println("Collecing information ended for ID:"+jsTraceInfo.sid);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			experiment.stop();
		}
	}
/*	//step2: trace generating
	void weakAnalysisStep2(){
		try {
			for(int i=0;i<Configuration.jsTraceRecordings.size();i++){
				TraceInfo jsTraceInfo = Configuration.jsTraceRecordings.get(i);
				
				
				URL url = new URL(Configuration.JSTRACE_STEP1_SERVICE+"?sid="+jsTraceInfo.sid
						+"&errors="+jsTraceInfo.errors+"&expected="+join(jsTraceInfo.expected));
				
				HttpURLConnection conn = (HttpURLConnection) url.openConnection();
				conn.setRequestMethod("GET");
				conn.connect();
				
				if(conn.getResponseCode() == 200)
					System.out.println("Candidate generating task submitted succesfully for ID:"+jsTraceInfo.sid);
				conn.disconnect();
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}*/
	
	//step2: validating by execution
	void weakAnalysisStep2(){
		JSTraceAdapter experiment = new JSTraceAdapter(
				Configuration.PROXY_JSTRACE_REPLAY_PAC, false);

		Gson gson = new Gson();
		try {
			experiment.init();
			for(int i=0;i<Configuration.jsTraceRecordings.size();i++){
				TraceInfo jsTraceInfo = Configuration.jsTraceRecordings.get(i);
				System.out.println("Candidate validating begin for ID:"+jsTraceInfo.sid);
				long totalTime = 0;
				File traceFile = new File("./experiment/jstrace", jsTraceInfo.sid+".result");
				FileUtils.copyURLToFile(new URL(Configuration.JSTRACE_FILE_SERVICE+"?filename="+jsTraceInfo.sid+"_z3/result"), traceFile);
				DataType json = gson.fromJson(FileUtils.readFileToString(traceFile), DataType.class);
				jsTraceInfo.policy(Configuration.POLICY_DELTA);
				experiment.setLogFile(jsTraceInfo.logFile());
				for(int k=0;k<json.candidates.size();k++){
					experiment.executeEvents(jsTraceInfo,json.candidates.get(k));
					totalTime += Long.valueOf((String)jsTraceInfo.extra.get("time"));
				}
				experiment.info("Generating time:"+json.constraintSolvingTime);
				experiment.info("Validating time:"+totalTime);
				experiment.info("Total time(gen+validate):"+(json.constraintSolvingTime+totalTime)+"ms");
				System.out.println("Candidate validating ended for ID:"+jsTraceInfo.sid);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			experiment.stop();
		}
	}
	public void runStep(int step){
		if(step==1) weakAnalysisStep1();
		else if(step ==2) weakAnalysisStep2();
//		else if(step == 3) weakAnalysisStep3();
	}
	//TODO: not fully automated yet!
	// need: 1. run weakAnalysisStep1; 2. JsTrace_project and run sh jsmin.sh; 3. run weakAnalysisStep2;
	// result files can be found under folder experiment/results/weak_*
	@Test
	public void weakAnalysisWithJsTraceRecordings(){
		//runStep(1);
		runStep(2);
		//runStep(3);		
	}
	
	//Result can be found under folder experiment/result/dd_*
	//@Test
	public void deltaDebuggingWithJstraceRecordings() {
		JSTraceAdapter experiment = new JSTraceAdapter(
				Configuration.PROXY_JSTRACE_REPLAY_PAC, false);
		try {
			experiment.init();
			for(int i=0;i<Configuration.jsTraceRecordings.size();i++){
				experiment.deltaDebugging(Configuration.jsTraceRecordings.get(i).policy(Configuration.POLICY_DELTA));
				Thread.sleep(50);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			experiment.stop();
		}
	}
	//used to check delta-debugging search space
	//@Test 
	public void deltaDebuggingMotivationExample() {
		JSTraceAdapter experiment = new JSTraceAdapter();
		try {
			//experiment.init();
			for(int i=0;i<Configuration.deltaDebuggingMotivationExample.size();i++){
				experiment.getDeltaDebuggingSubtraces(Configuration.deltaDebuggingMotivationExample.get(i).policy(Configuration.POLICY_DELTA));
				Thread.sleep(50);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			//experiment.stop();
		}
	}
	
	String join(List<Integer> list){
		String res = "";
		Iterator<Integer> it = list.iterator();
		while(it.hasNext()){
			res+=it.next()+",";
		}
		res = res.substring(0, res.length()-1);
		return res;
	}
}
class DataType{
	List<Integer> expected;
	List<Integer> solution;
	List<List<Integer>> candidates;
	Integer rank;
	Integer constraintSolvingTime;
}