import sys
fileL = sys.argv[1]
alpha = sys.argv[2]
TextList = []
with open(fileL,'r') as f:
        for line in f:
                TextList.append(line.split(None,1)[0])
capacity = len(TextList)
index = 0
while index!=capacity:
        line = TextList[index]
        for word in line.split():
            l = word[0]
            l = l.upper()
            if l in alpha:
                print(line)

            #print word[0]
            index = index+1
