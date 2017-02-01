package tests.jstrace;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import tests.Configuration;
import edu.unl.webtesting.DD;

public class TraceInfo {
	public String sid;
	public List<Integer> expected;
	public String errors;
	String policy;
	public Map<String,Object> extra = new HashMap();
	private String logFile;
	int traceLength;
	
	TraceInfo(String sid) {
		this.sid = sid;
	}

	public TraceInfo(String sid, Integer[] expected) {
		this.sid = sid;
		this.expected = Arrays.asList(expected);
	}
	public TraceInfo(String sid, int traceLength, Integer[] expected) {
		this.sid = sid;
		this.traceLength = traceLength;
		this.expected = Arrays.asList(expected);
	}
	public TraceInfo policy(String policy){
		this.policy = policy;
		return this;
	}
	public int test(List<Integer> subList) {
		if (subList.containsAll(this.expected))
			return DD.FAIL;
		return DD.PASS;
	}

	String traceURL() {
		return Configuration.JSTRACE_LOG_SERVER + "?sid=" + this.sid;
	}
	String replayURL(){
		return replayURL(Collections.EMPTY_LIST);
	}
	String replayURL(List<Integer> subList) {
		String url = Configuration.JATRACE_REPLAY_SERVER + "?sid=" + this.sid + "&policy="+this.policy;
		if(this.policy == Configuration.POLICY_DELTA)
			url+="&subset=" + subList.toString();
		else if(this.policy == Configuration.POLICY_WEAK)
			url+="&reduce=true&base=1";
		return url;
	}
	public String logFile(){
		if(this.logFile==null)
			this.logFile = "./experiment/results/weak_"+this.sid+"_"+new SimpleDateFormat("yyyy.MM.dd HH'h' mm'm' ss's'").format(new Date());
		return this.logFile;
	}
}