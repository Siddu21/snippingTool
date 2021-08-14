/* 
	Author: Siddeshwar Ayyappagari 
	concept : cropping the draggable elements into images
*/

var scrollDivs = () => {
	var self = this;
	// elements creation in bulk
	self.groupElements = (arr) => {
		arr.forEach(function(e){
			self.createNewBox(e);
		})		
	};
	//global variables function
	self.initVariables = () => {
		self.addDiv = document.getElementsByClassName('addDiv')[0];
		self.container = document.getElementsByClassName('container')[0];	
		self.recycle = document.getElementsByClassName('recycle')[0];
		self.deleteCheckBox = document.getElementsByClassName('deleteCheckBox')[0];		
		self.allDivsInfo = {};			
		self.pos1 = 0;
		self.pos2 = 0;
		self.pos3 = 0;
		self.pos4 = 0;
		self.num = 0;
		self.realMouseX = 0;
		self.realMouseY = 0;
		self.originalDivX = 0;
		self.originalDivY = 0;
		self.originalDivWidth = 150;
		self.originalDivHeight = 150;
		self.minimumSize = 100;		
	}	
	self.stopResize = (e) =>{		
		// removing listener when clicking outside the element	
		window.removeEventListener('mousemove', self.dragResizeDiv,true);			
	} 
	// Assiging positions for dynamic div while draggingg........
	self.dragResizeDiv = (e) => {				
		e.preventDefault();										
			if(self.activeElement.classList.contains('corner4')){
				// when element is dragging from top left
				const width = self.originalDivWidth - (e.pageX - self.realMouseX);		
				const height = 	self.originalDivHeight - (e.pageY - self.realMouseY);				
				const elementPositions = self.activeElement.parentNode.getBoundingClientRect();												
				if(elementPositions.y <= 0){					
					self.activeElement.parentNode.style.top = 1 + 'px';
				}else if(elementPositions.x <= 0){
					self.activeElement.parentNode.style.left = 1 + 'px';
				}else if(height > self.minimumSize && elementPositions.y > 0){
					self.activeElement.parentNode.style.height =  height + 'px';	
					self.activeElement.parentNode.style.top = 	self.originalDivY + (e.pageY - self.realMouseY) + 'px';							
				}
				if(width > self.minimumSize && elementPositions.x > 0){
					self.activeElement.parentNode.style.width = width + 'px';	
					self.activeElement.parentNode.style.left = self.originalDivX + 	(e.pageX - self.realMouseX) + 'px';				
				}				
			} else if(self.activeElement.classList.contains('corner3')){
				// when element is dragging from bottom right		
				const width = self.originalDivWidth + (e.pageX - self.realMouseX);		
				const height = 	self.originalDivHeight + (e.pageY - self.realMouseY);
				const elementPositions = self.activeElement.parentNode.getBoundingClientRect();										
				if(width > self.minimumSize){					
					self.activeElement.parentNode.style.width = width + 'px';											
				}
				//console.log(elementPositions.height);
				if(elementPositions.top + elementPositions.height >= window.innerHeight - 5){									
					self.activeElement.parentNode.style.height = parseInt(self.activeElement.parentNode.style.height) - 1 + 'px';
				}else if(height > self.minimumSize){
					self.activeElement.parentNode.style.height = height + 'px';							
				}				
			} else if(self.activeElement.classList.contains('corner2')){				
				// when element is dragging from bottom left				
				const width = self.originalDivWidth - (e.pageX - self.realMouseX);		
				const height = 	self.originalDivHeight + (e.pageY - self.realMouseY);								
				if(width > self.minimumSize){
					self.activeElement.parentNode.style.width = width + 'px';	
					self.activeElement.parentNode.style.left = 	self.originalDivX + (e.pageX - self.realMouseX) + 'px';					
				}
				if(height > self.minimumSize){
					self.activeElement.parentNode.style.height =  height + 'px';													
				}													
			} else if(self.activeElement.classList.contains('corner1')){
				// when element is dragging from top right					
				const width = self.originalDivWidth + (e.pageX - self.realMouseX);		
				const height = 	self.originalDivHeight - (e.pageY - self.realMouseY);
				const elementPositions = self.activeElement.parentNode.getBoundingClientRect();					
				if(elementPositions.y <= 0){
					// if element is going beyond screen
					self.activeElement.parentNode.style.top = 1 + 'px';
				}else if(height > self.minimumSize){
					self.activeElement.parentNode.style.height =  height + 'px';					
					self.activeElement.parentNode.style.top = self.originalDivY + (e.pageY - self.realMouseY) + 'px';
				}								
				if(width > self.minimumSize){
					self.activeElement.parentNode.style.width = width + 'px';						
				}																				
			}else{				
				// when whole element is dragging		
				const elementPositions = self.activeElement.getBoundingClientRect();																		
				self.pos1 = self.pos3 - e.clientX;
				self.pos2 = self.pos4 - e.clientY;
				self.pos3 = e.clientX;
				self.pos4 = e.clientY;
				// set the element's new position and stoping not to cross beyond the screen 
				if (elementPositions.x > (window.innerWidth - elementPositions.width)){
					self.activeElement.style.left = (window.innerWidth - elementPositions.width) + 'px';					
				}else if(elementPositions.y > (window.innerHeight - elementPositions.height)){
					self.activeElement.style.top = (window.innerHeight - elementPositions.height) + 'px';
				}else if(elementPositions.x > 0 && elementPositions.y >0){
					self.activeElement.style.top = (self.activeElement.offsetTop - self.pos2) + 'px';
					self.activeElement.style.left = (self.activeElement.offsetLeft - self.pos1) + 'px';					
				}// if positions are out of screen
				else if(elementPositions.x <= 0){									
					self.activeElement.style.left = 1 + 'px';
				}else if(elementPositions.y <= 0){					
					self.activeElement.style.top = 1 + 'px';
				}				
			}
			// remove dragging when we click outside the element	
			window.addEventListener('mouseup', self.stopResize);							
	};
	// remove box	
	self.eraseElement = (e) => {
		e.stopPropagation();
		var removeElem = e.target.parentNode;
		removeElem.parentNode.removeChild(removeElem);						
		delete self.allDivsInfo['block'+removeElem];
		delete self.allDivsInfo['block'+removeElem.getAttribute('data-block')];
		console.log(self.allDivsInfo); 
	}
	// print the element
	self.printElement = (e) => {
		e.stopPropagation();
		// stopping the print of element if another printing is in process
		if ( self.isPrinting ) {
			return;
		}
		self.isPrinting = true;
			var sourceElem = document.querySelector('.screen'),
				resizeElem = e.target.parentNode,				
				resizeElemDimensions = resizeElem.getBoundingClientRect();		
		// Getting image of cropped element							
		html2canvas(sourceElem,{			
			onrendered : function(canvas){														
				var ctx = canvas.getContext('2d'),
					imageData = ctx.getImageData(resizeElemDimensions.x,resizeElemDimensions.y,resizeElemDimensions.width,resizeElemDimensions.height),
					requiredImage = document.createElement('canvas');

				requiredImage.width = resizeElemDimensions.width;
				requiredImage.height = resizeElemDimensions.height;

				requiredImageCtx = requiredImage.getContext('2d');
				
				requiredImageCtx.putImageData(imageData,0,0);
				document.body.appendChild(requiredImage);		
				self.isPrinting = false;
			}
		})		
	}
	// listener function when mouse up
	self.mouseUp = (e) => {				
		var currentElemNum = e.target.getAttribute('data-block'),
		currentElemNumStyles =e.target.getBoundingClientRect();	
		    // when click is releasing from corners of element
			if(!currentElemNum){
				currentElemNum = e.target.parentNode.getAttribute('data-block');
				currentElemNumStyles =e.target.parentNode.getBoundingClientRect();
			}		
		self.allDivsInfo['block'+currentElemNum] = {};
		self.allDivsInfo['block'+currentElemNum]['leftPosition'] = currentElemNumStyles.left + 'px';
		self.allDivsInfo['block'+currentElemNum]['topPosition'] = currentElemNumStyles.top + 'px';
		self.allDivsInfo['block'+currentElemNum]['width'] = currentElemNumStyles.width + 'px';
		self.allDivsInfo['block'+currentElemNum]['height'] = currentElemNumStyles.height + 'px';		
		e.target = null;	
		window.removeEventListener('mousemove', self.dragResizeDiv, true);			
		//console.log(self.allDivsInfo); 
	}
	// listener function when mouse down
	self.mouseDown = (e) => {					
		e.preventDefault();
		self.activeElement = e.target;			
		self.pos3 = e.clientX;
		self.pos4 = e.clientY;
		self.realMouseX = e.pageX;
		self.realMouseY = e.pageY;		
		self.originalDivX = self.activeElement.getBoundingClientRect().left;
		self.originalDivY = self.activeElement.getBoundingClientRect().top;		
		window.addEventListener('mousemove', self.dragResizeDiv, true);	
		// if click is on corners of div
		if(self.activeElement.classList.contains('resizableCorner')){
			self.originalDivWidth = self.activeElement.parentNode.getBoundingClientRect().width;
			self.originalDivHeight = self.activeElement.parentNode.getBoundingClientRect().height;			
		}					
	}
	// assigning the styles of div
	self.draggableDivStyles = () => {		
		// initialising random position to newly created divs
		self.resizeDivPosition = {
			top: Math.floor(Math.random() * (window.innerHeight-100)),
			left: Math.floor(Math.random() *  (window.innerWidth-100)),
			bgColor: 'rgba('+Math.floor(Math.random()*255)+','+ Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255) +', 1)'
		}			
		/* if the div goes out of the area then again this function is called*/
		if ( self.resizeDivPosition.top > window.innerHeight || 
			self.resizeDivPosition.left > window.innerWidth ||
			(self.resizeDivPosition.left == 0 && self.resizeDivPosition.top == 0) ) {
			self.draggableDivStyles();			
			return;			
		}							
	}
	// create new box
	self.createNewBox = (arrayVal) => {	
		self.num += 1;	
		// element creation		
		self.resizeDiv = document.createElement('div');	
		self.close = document.createElement('p');		
		self.close.innerHTML  = 'X';			
		self.print = document.createElement('button');
		self.print.innerHTML = 'Print';		
		// assigning classes
		self.close.classList.add('closeDiv');
		self.print.classList.add('print');
		self.resizeDiv.classList.add('resizable');			
		self.resizeDiv.setAttribute('data-block', self.num);
		self.resizeDiv.appendChild(self.close);	
		self.resizeDiv.appendChild(self.print);	
		// divs for corners	
		for(var i=0; i<4;i++){
			var innerDiv = document.createElement('div');
			innerDiv.classList.add('resizableCorner','corner'+(i+1));			
			self.resizeDiv.appendChild(innerDiv);						
		}	
		// styling for dynamic div		
		self.draggableDivStyles();					
		// assigning random position to newly created divs		
		self.resizeDiv.style.left = arrayVal.left ? arrayVal.left + 'px' : self.resizeDivPosition.left + 'px';
		self.resizeDiv.style.top = arrayVal.top ? arrayVal.top + 'px' : self.resizeDivPosition.top + 'px';
		self.resizeDiv.style.width = arrayVal.width ? arrayVal.width + 'px' : self.originalDivWidth + 'px';
		self.resizeDiv.style.height = arrayVal.height ? arrayVal.height + 'px' : self.originalDivHeight + 'px'; 		
		self.container.appendChild(self.resizeDiv);	
		// binding events for dynamic created elements
		self.resizeDiv.addEventListener('mousedown', self.mouseDown ,false);		
		self.resizeDiv.addEventListener('mouseup', self.mouseUp ,false);
		self.close.addEventListener('mousedown',self.eraseElement);
		self.print.addEventListener('mousedown',self.printElement);
	}	
	// bind events function
	self.bindEvents = () => {	
		// create dynamic div 	
		self.addDiv.addEventListener('click', self.createNewBox);				
	}

    self.init = () => {
		/* calling the global  variables */
		self.initVariables();
		/* calling the bindevents function*/
		self.bindEvents();
	}
	// first call function
	return {
		init: init
	}
}
scrollDivs().init();