function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function containsFillStyleID(fillStyleId, colors) {
    var i;
    for (i = 0; i < colors.length; i++) {
        if (colors[i].fillStyleId === fillStyleId) {
            return true;
        }
    }
		return false;
}

function contains(item, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === item) {
            return true;
        }
    }
		return false;
}

function getIndexofFillStyleId(fillStyleId, list) {
    var i;
		print
    for (i = 0; i < list.length; i++) {
        if (list[i].fillStyleId === fillStyleId) {
            return i;
        }
    }
}

function getColorObjectofFillStyleId(fillStyleId) {
    var i;
    for (i = 0; i < colors.length; i++) {
        if (colors[i].fillStyleId === fillStyleId) {
            return colors[i];
        }
    }
}


function createArrayofUniqueColors(selection, array) {
	for(let i = 0; i < selection.length; i++) {
	if(!containsFillStyleID(selection[i].fillStyleId, colors)) {
			colors.push({fillStyleId: selection[i].fillStyleId, usageCount: 1, questions: []})
	}
	else {
		colors[getIndexofFillStyleId(selection[i].fillStyleId, colors)].usageCount += 1
	}
}
}

function generateQuestions(operator, numFirstAndSecondBlank, numThirdBlank) {
	let res = []
	switch(operator) {
		case "*":
			for(let i = 0; i < numFirstAndSecondBlank; i++) {
				let bool useBlank1 = getRandomInt(2) == 0 ? true : false
				// let bool useBlank1 = true
				let answerUsed = true
				let ans = null
				let num1 = null
				let num2 = null
				let blank = null
				while(answerUsed) {
					num1 = numPool[getRandomInt(numPool.length)]
					num2 = numPool[getRandomInt(numPool.length)]
					ans = num1*num2	
					blank = useBlank1 ? num1 : num2
					answerUsed = contains(blank, usedAnswers)
				}
				usedAnswers.push(blank)
				let type = useBlank1 ? "FIRST-BLANK" : "SECOND-BLANK"
				let text = useBlank1 ? ["x" + num2 + " = " + ans,] : [num1 + "x", "= " + ans]
				res.push({type: type, text: text, answer: blank})
			}
			for(let i = 0; i < numThirdBlank; i++) {
				let answerUsed = true
				let ans = null
				let num1 = null
				let num2 = null
				while(answerUsed) {
					num1 = numPool[getRandomInt(numPool.length)]
					num2 = numPool[getRandomInt(numPool.length)]
					ans = num1*num2	
					answerUsed = contains(ans, usedAnswers)
				}
				usedAnswers.push(ans)
				res.push({type: "THIRD-BLANK", text: [num1 + "x" + num2 + " =",], answer: ans})
			}
			break;
		case "/":
			for(let i = 0; i < numFirstAndSecondBlank; i++) {
				let bool useBlank2 = getRandomInt(2) == 0 ? true : false
				// let bool useBlank1 = true
				let answerUsed = true
				let ans = null
				let num1 = null
				let num2 = null
				let blank = null
				while(answerUsed) {
					num1 = numPool[getRandomInt(numPool.length)]
					num2 = numPool[getRandomInt(numPool.length)]
					ans = num1*num2	
					blank = useBlank2 ? num1 : num2
					answerUsed = contains(blank, usedAnswers)
				}
				usedAnswers.push(blank)
				let type = useBlank2 ? "SECOND-BLANK" : "THIRD-BLANK"
				let text = useBlank2 ? [ans + "÷", "= " + num2,] : [ans + "÷" + num1 + " =",]
				res.push({type: type, text: text, answer: blank})
			}
			for(let i = 0; i < numThirdBlank; i++) {
				let answerUsed = true
				let ans = null
				let num1 = null
				let num2 = null
				let blank = null
				while(answerUsed) {
					num1 = numPool[getRandomInt(numPool.length)]
					num2 = numPool[getRandomInt(numPool.length)]
					ans = num1*num2	
					blank = ans
					answerUsed = contains(blank, usedAnswers)
				}
				usedAnswers.push(blank)
				res.push({type: "FIRST-BLANK", text: ["÷" + num1 + " =" + num2,], answer: blank})
			}
			break;
		default: 
			print("INVALID OPERATOR")
	}
	shuffleArray(res)
	return res;
}

function createQuestionRow(colorIndex, xOffset, yOffset, questionsPerRow, colorsPerRow) {
	let currentQuestionTemplate = null
	switch(questionType) {
		case questionTypes.SIMPLEMULTIPLICATION:
			colors[colorIndex].questions = generateQuestions("*", 0, 3*questionsPerRow)
			break;
		case questionTypes.MIXEDMULTIPLICATION:
			colors[colorIndex].questions = generateQuestions("*", questionsPerRow, 2*questionsPerRow)
			break;
		case questionTypes.MIXEDDIVISION:
			colors[colorIndex].questions = generateQuestions("/", questionsPerRow, 2*questionsPerRow)
			break;
	}		
	let questionTemplate1 = figma.currentPage.findChild(n => n.name === "Blank1Temp")
	let questionTemplate2 = figma.currentPage.findChild(n => n.name === "Blank2Temp")
	let questionTemplate3 = figma.currentPage.findChild(n => n.name === "Blank3Temp")
	let underline = null
	let text = null
	let answerOffset = null
	for(let j = 0; j < colors[colorIndex].questions.length; j++) {
		switch(colors[colorIndex].questions[j].type) {
			case "FIRST-BLANK":
				currentQuestionTemplate = questionTemplate1.clone();
				underline = currentQuestionTemplate.findChild(n => n.name === "Underline")
				text = currentQuestionTemplate.findChild(n => n.name === "Text")
				text.characters = colors[colorIndex].questions[j].text[0]
				currentQuestionTemplate.x = 35.31 + xOffset + Math.floor(j/3)*(questionsOutlineRect.	width / colorsPerRow)/2
				currentQuestionTemplate.x += j > 2 ? -5 : 3
				currentQuestionTemplate.y = yOffset + (j%3)*28
				underline.resize((questionsOutlineRect.width / colorsPerRow)/questionsPerRow - text.width - 30, 0)
				text.x = underline.x + underline.width + 3
				answerOffset = underline.width/2 - 10

				break;
			case "SECOND-BLANK":
				currentQuestionTemplate = questionTemplate2.clone();
				underline = currentQuestionTemplate.findChild(n => n.name === "Underline")
				let textR = currentQuestionTemplate.findChild(n => n.name === "TextR")
				let textL = currentQuestionTemplate.findChild(n => n.name === "TextL")
				textL.characters = colors[colorIndex].questions[j].text[0]
				textR.characters = colors[colorIndex].questions[j].text[1]
				currentQuestionTemplate.x = 35.31 + xOffset + Math.floor(j/3)*(questionsOutlineRect.	width / colorsPerRow)/2
				currentQuestionTemplate.x += j > 2 ? -5 : 3
				currentQuestionTemplate.y = yOffset + (j%3)*28
				underline.resize((questionsOutlineRect.width / colorsPerRow)/questionsPerRow - textL.width - textR.width - 30, 0)
				underline.x = textL.x + textL.width + 3
				textR.x = textL.width + underline.width + 5
				answerOffset = textL.width + underline.width/2 - 10
				break;
			case "THIRD-BLANK":
				currentQuestionTemplate = questionTemplate3.clone();
				underline = currentQuestionTemplate.findChild(n => n.name === "Underline")
				text = currentQuestionTemplate.findChild(n => n.name === "Text")
				text.characters = colors[colorIndex].questions[j].text[0]
				currentQuestionTemplate.x = 35.31 + xOffset + Math.floor(j/3)*(questionsOutlineRect.	width / colorsPerRow)/2
				currentQuestionTemplate.x += j > 2 ? -5 : 3
				currentQuestionTemplate.y = yOffset + (j%3)*28
				underline.resize((questionsOutlineRect.width / colorsPerRow)/questionsPerRow - text.width - 30, 0)
				underline.x = text.x + text.width + 3
				answerOffset = text.width + underline.width/2 - 10
				break
		}
		questionGroup.appendChild(currentQuestionTemplate)



		//CreateAnswerText
		let currentAnswerText = figma.currentPage.findChild(n => n.name === "AnswerText").clone()
		questionGroup.appendChild(currentAnswerText)
		currentAnswerText.findChild(n => n.name === "Text").characters = colors[colorIndex].questions[j].answer.toString()
		currentAnswerText.y = currentQuestionTemplate.y - 3
		currentAnswerText.x = currentQuestionTemplate.x + answerOffset
		if(answerGroup == null) {
			answerGroup = figma.group([currentAnswerText], frame)
			answerGroup.name = "Ans"
		}
		else {
			answerGroup.appendChild(currentAnswerText)
		}
	}
}

const questionTypes = {
	SIMPLEMULTIPLICATION: "T*",
	MIXEDMULTIPLICATION: "TMixed*",
	MIXEDDIVISION: "TMixed/"
}

let numPool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]




//SELECT TEMPLATE FRAME BEFORE RUNNING

let frame = figma.currentPage.selection[0]
let colors = []
let questionType = frame.name.split(" - ")[0]
let pictureName  = frame.name.split(" - ")[1]

const gridGroup = frame.findChild(n => n.name === "Grid")
const questionGroup = frame.findChild(n => n.name === "Questions")

//Add all unique selected fillStyles to array
createArrayofUniqueColors(gridGroup.children,colors)


let questionBoxWidth = 559.62
let questionBoxHeight = 246.83

//Sort colors based on ascending usageCount
colors.sort(function(a, b) {return a.usageCount - b.usageCount})

let bottomRowAmount = parseInt(colors.length/2)
let topRowAmount = colors.length - bottomRowAmount

let colorTitle = figma.currentPage.findChild(n => n.name === "ColorTitle")
let verticalSplitter = figma.currentPage.findChild(n => n.name === "VerticalSplitter")
let questionsOutlineRect = questionGroup.findChild(n => n.name === "OutlineRect")

let usedAnswers = []
let answerGroup = null
let xPadding = 20
//CreateTopQuestionRow
let numQuestionsinRowTop = topRowAmount > 2? 1: 2;
for(let i = 0; i < topRowAmount; i++) {
	//Create All Top Color Titles
	let currentColorTitle = colorTitle.clone()
	let xOffset = i*(questionsOutlineRect.width / topRowAmount)
	let currentColorNameNode = currentColorTitle.findChild(n => n.name === "ColorName")
	let currentColorOutline = currentColorTitle.findChild(n => n.name === "Outline")
	currentColorNameNode.characters = figma.getStyleById(colors[i].fillStyleId).name
	questionGroup.appendChild(currentColorTitle)
	currentColorTitle.y = 530.17
	currentColorTitle.x = 27.11 + xOffset
	currentColorOutline.resize(currentColorNameNode.width + 20, currentColorOutline.height)

	//Create All Top Splitters
	if(i > 0 && i < topRowAmount) {
		let currentSplitter = verticalSplitter.clone()
		questionGroup.appendChild(currentSplitter)
		currentSplitter.y = 530.17
		currentSplitter.x = 27.11 + xOffset
	}

	//Create Top Questions 
	createQuestionRow(i, xOffset, 564.69, numQuestionsinRowTop, topRowAmount)
}


//Create Bottom Question Row
let numQuestionsinRowBottom = bottomRowAmount > 2? 1: 2;
for(let i = topRowAmount; i < colors.length; i++) {
	//Create All Bottom Color Titles
	let currentColorTitle = colorTitle.clone()
	let xOffset = (i - topRowAmount)*(questionsOutlineRect.width / bottomRowAmount)
	let currentColorNameNode = currentColorTitle.findChild(n => n.name === "ColorName")
	let currentColorOutline = currentColorTitle.findChild(n => n.name === "Outline")
	currentColorNameNode.characters = figma.getStyleById(colors[i].fillStyleId).name
	questionGroup.appendChild(currentColorTitle)
	currentColorTitle.y = 653.58
	currentColorTitle.x = 27.11 + xOffset
	currentColorOutline.resize(currentColorNameNode.width + 20, currentColorOutline.height)

	//Create All Bottom Splitters
	if(i > topRowAmount && i < colors.length) {
		let currentSplitter = verticalSplitter.clone()
		questionGroup.appendChild(currentSplitter)
		currentSplitter.y = 654.35
		currentSplitter.x = 27.11 + xOffset
	}
	
	//Create Bottom Questions 
	createQuestionRow(i, xOffset, 686, numQuestionsinRowBottom, bottomRowAmount)
}


//Create NumberGrid
let gridItems = gridGroup.children
let gridTextTemplate = figma.currentPage.findChild(n => n.name === "GridText")
let gridNumbersGroup = null
for(let i = 0; i < gridItems.length; i ++) {
	let currentQuestions = getColorObjectofFillStyleId(gridItems[i].fillStyleId).questions
	let currentText = gridTextTemplate.clone()
	if(gridNumbersGroup == null) {
		gridNumbersGroup = figma.group([currentText], frame)
		gridNumbersGroup.name = "Nums"
	}
	else {
		gridNumbersGroup.appendChild(currentText)
	}
	currentText.x = gridItems[i].x + gridItems[i].width/4 - 1
	currentText.y = gridItems[i].y + gridItems[i].width/4
	currentText.findChild(n => n.name === "Text").characters = currentQuestions[getRandomInt(currentQuestions.length)].answer.toString()
}

let answerKey = frame.clone()
let p2 = frame.clone()
answerKey.y += 1000
answerKey.name = "AK"

p2.y += 3000
p2.name = "P2"

gridGroup.visible = false
answerGroup.visible = false

let p1 = frame.clone()
p1.y += 2000
p1.name = "P1"

let watermark = figma.currentPage.findChild(n => n.name === "Watermark").clone()
watermark.x = 65.5
watermark.y = 65.37
p1.appendChild(watermark)
p2.appendChild(watermark.clone())

frame.name = "Worksheet"

let cover = figma.currentPage.findChild(n => n.name === "CoverTemp").clone()

let smallFrame = answerKey.clone()
smallFrame.rescale(0.7)
let smallGrid = smallFrame.findChild(n => n.name === "Grid").clone()
let smallNums = smallFrame.findChild(n => n.name === "Nums").clone()
let coverGrid = figma.group([smallGrid, smallNums], cover)




cover.x = p2.x
cover.y = p2.y + 1000
cover.name = "Cover"
let mainCoverOnly = cover.findChild(n => n.name === "MainCoverOnly")
mainCoverOnly.findChild(n => n.name === "Title").characters = questionType == questionTypes.MIXEDDIVISION ? "1-12 Division" : "1-12 Multiplication" 
cover.findChild(n => n.name === "Bottom Text").findChild(n => n.name === "RedText").characters = pictureName
cover.appendChild(coverGrid)
coverGrid.x = 345.08
coverGrid.y = 132.12
coverGrid.rotation = -12.84
coverGrid.effects = [figma.getLocalEffectStyles()[0].effects[0],]
mainCoverOnly.insertChild(3, coverGrid)

let t1 = cover.clone()
t1.y += 800
t1.name = "T1"
t1.findChild(n => n.name === "MainCoverOnly").remove()
let t1GodRay = t1.findChild(n => n.name === "GodRay")
t1GodRay.x = -552.52 
t1GodRay.y = -474.03

let smallWorksheet = smallFrame.clone()
t1.appendChild(smallWorksheet)
smallWorksheet.rescale(0.87)
smallWorksheet.x = 126.19
smallWorksheet.y = 50.72
smallWorksheet.rotation = 4.35
smallWorksheet.effects = [figma.getLocalEffectStyles()[1].effects[0],]
smallWorksheet.cornerRadius = 2.18
t1.findChild(n => n.name === "SmallFrameBackground").visible = true

let t2 = t1.clone()
t2.y += 800
t2.name = "T2"

smallWorksheet.findChild(n => n.name === "Ans").remove()
smallWorksheet.findChild(n => n.name === "Grid").remove()



