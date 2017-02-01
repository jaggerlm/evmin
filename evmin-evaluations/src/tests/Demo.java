package tests;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;

import tests.jstrace.TraceInfo;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

public class Demo {
	public static void main(String[] args) {
		try {
			if(args.length<2){
				printHelp();
				return;
			}
			
			InData data = new Gson().fromJson(new FileReader(new File(args[0])), InData.class);
			TraceInfo traceInfo = new TraceInfo(data.sid, data.expected);
			traceInfo.errors = data.errors;
			Configuration.jsTraceRecordings = new ArrayList<TraceInfo>(){{
				add(traceInfo);
			}};
			
			runTests test = new runTests();
			String step = args[1];
			if("1".equals(step))
				test.runStep(1);
			else if("2".equals(step))
				test.runStep(2);
			else 
				printHelp();
			
		} catch (JsonSyntaxException | JsonIOException | FileNotFoundException e) {
			System.out.println("ERROR: input file not exist or wrong input format");
		}
	}
	static void printHelp(){
		System.out.println("Command format: java -jar jsmin.jar <configfile> <step>");
		System.out.println("   * configfile: configure basic params for the log to be reduced");
		System.out.println("   * step: 1(information collecting and candidates generating), 2(candidate generating)");
	}
}

class InData{
	String sid;
	String errors;
	Integer[] expected;	
}
