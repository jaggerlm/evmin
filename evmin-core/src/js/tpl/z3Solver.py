from z3 import *
from datetime import datetime

class Logger:
    def __init__(self,logName):
        self.logSat = logName + '.sat';
        self.logUnsat = logName + '.unsat';
        try:
            os.remove(self.logSat);
            os.remove(self.logUnsat);
        except:
            None
    def info(self,filename,args):
        f = open(filename,'a+');
        for i in range(len(args)):
            f.write(str(args[i])+'\n');
        f.write('\n');
        f.close();
    def sat(self,s):
        self.info(self.logSat,['>>>assertions:'+str(s.assertions()),'>>>model:'+str(s.model())]);
    def unsat(self,s):
        self.info(self.logUnsat,['>>>assertions:'+str(s.assertions()),'>>>unsat:'+str(s.unsat_core())]);

class Events:
    def add(self,name):
        setattr(self, name, Int(name));
    def __getitem__(self,name):
        return getattr(self,name);
    def __setitem__(self,name,value):
        return setattr(self,name,value);
 
    def props(self):   
        return [i for i in self.__dict__.keys() if i[:1] != '_']

def solveSeqGen(s,maxL,maxSolutionsForEachLengh,v,selected,generatings,fileName,expected):
    solutionsForEachLen = {};
    for name in v.props():
        s.add(Or(v[name]==1,v[name]==0));
    for i in range(len(selected)):
        s.add(v['e'+str(selected[i])]==1);
    for i in generatings.keys():
        s.add(generatings[i]);
    esum = -1;
    for x in v.props():
        esum += v[x];
    length = 0; 
    for i in range(1,maxL):
        solutionsForEachLen[i] = [];
        s.push();
        s.add(simplify(esum==(i)));
        if _whileSat(s,solutionsForEachLen[i],maxSolutionsForEachLengh,expected):
            length += len(solutionsForEachLen[i]);
            break;
        s.pop();
    _save(s,{'solutions':solutionsForEachLen,'length':length},fileName);

def solveSeqValid(s,v,validatings,solutions,fileName):
    validated = {};
    for name in v.props():
        s.add(Or(v[name]==1,v[name]==0));
    for x in solutions.keys():
        validated[x] = [];
        for y in range(len(solutions[x])):
            s.push();
            arr = solutions[x][y];
            for i in range(len(arr)):
                s.add(v['e'+str(arr[y])] == 1);
            for z in validatings:
                s.add(validatings[z]);
            selected = _check();
            if(selected !=None):
                validated[x].append(solutions[x][y]);
       
            s.pop();
    _save(s,validated,fileName);

def _declareEvents(events):
    v = Events();
    for i in range(len(events)):
        name = 'e'+str(events[i]);
        v.add(name);
    return v;
def _check():
    global logger;
    if s.check() == sat:
        m = s.model();
        selectedEvents = [];
        for d in m.decls():
            if is_true(m.evaluate(m[d] == 1)):
                selectedEvents.append(d.name());
        logger.sat(s);
        return selectedEvents;
    logger.unsat(s);
    return None;
def _isSolutionFound(result, expected):
    print 'check selected:', result, ', time left:', timeout
    return set(expected).issubset(result)

def _whileSat(s,solutions,maxSolutionsForEachLengh,expected):
    global timeout;
    count = 0;
    while True:
        if timeout <=0:
            return False;
        s.push();
        s.add(_forceNewSolution(solutions));
        timeStart = datetime.now(); 
        selected = _check();
        timeLasting = datetime.now() - timeStart;
        s.pop();
        if(selected == None):
            break;
        else:
            selected = sorted([int(selected[y][1:]) for y in range(len(selected))]);
            solutions.append({'list':selected,'time':timeLasting.total_seconds()});
            timeout = timeout - timeLasting.total_seconds();
            count = count+1;
            if count>=maxSolutionsForEachLengh:
                break;
            if _isSolutionFound(selected,expected):
                return True;

def _forceNewSolution(solutions):
    negateAll = And(True,True);
    for x in range(len(solutions)):
        selectedEvs = solutions[x]['list'];
        negateEach = Or(False,False);
        for name in range(len(selectedEvs)):
            negateEach = Or(negateEach, v['e'+str(selectedEvs[name])] == 0);
        negateAll = And(negateAll,negateEach); 
    return simplify(negateAll);

def _save(s,result, filename):
    solutions = result['solutions'];
    f = open(filename, 'w')
    f.write('solutionForEachLen={}\n');
    for i in solutions.keys():
        if len(solutions[i])>0:
            toSave = [];
            for x in range(len(solutions[i])):
                toSave.append(solutions[i][x]);
            f.write('solutionForEachLen['+str(i)+']'+'='+ str(toSave)+'\n');
    f.close();

if __name__ == '__main__':
    global logger;
