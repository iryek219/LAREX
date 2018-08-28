class Selector {
	constructor(editor, controller) {
		this._controller = controller;
		this._editor = editor;
		this.selectmultiple = false;
		this.selectpoints = false;
		this.selectModes = { POLYGON: 0, POINT: 1, CHAR: 2};
		this.selectMode = this.selectModes.POLYGON;
		this.isSelecting = false;
		this._selectedSegments = [];
		this._selectedPoints = [];
		this._selectedChars = [];
		this._polygonselectMode;
		this._typeLastSelected;
	}

	select(segmentID, points = []) {
		const typeSelected = this._controller.getIDType(segmentID);
		if(this._typeLastSelected !== typeSelected || !this.selectmultiple)
			this.unSelect();
		
		if(!(this._selectedSegments.length === 1 && this._selectedSegments[0] === segmentID)){
			this._selectedSegments.forEach(s => this._editor.setEditSegment(s,false));
			this._processSelectSegment(segmentID);
		}
		
		if(this._selectedSegments.length === 1){
			this._editor.setEditSegment(this._selectedSegments[0]);

			if(typeSelected === 'segment'){
				points.forEach(p => this._processSelectPoint(p,segmentID));
			} else {
				
			}
		}

		this._typeLastSelected = typeSelected;
		console.log(this._selectedSegments.length);
	}

	unSelect() {
		this._selectedSegments.forEach(segmentID => {
			this._editor.selectSegment(segmentID, false);
			this._editor.setEditSegment(segmentID,false)
		});

		this._selectedSegments = [];
		this._selectedPoints = [];
		this._selectedChars = [];
	}

	hasSegmentsSelected() {
		if (this._selectedSegments && _selected.length > 0) {
			return true;
		} else {
			return false;
		}
	}
	isSegmentSelected(segmentID) {
		if (this._selectedSegments && $.inArray(segmentID, this._selectedSegments) >= 0) {
			return true;
		} else {
			return false;
		}
	}
	startRectangleSelect() {
		if (!this._editor.isEditing) {
			if (!this.isSelecting) {
				this._editor.startRectangleSelect();
			}

			this.isSelecting = true;
		}
	}

	rectangleSelect(pointA, pointB) {
		switch(this.selectMode){
			case this.selectModes.POLYGON: 
				if ((!this.selectmultiple) || !(this._polygonselectMode === 'segment')) {
					this.unSelect();
				}

				const inbetween = this._editor.getSegmentIDsBetweenPoints(pointA, pointB);

				inbetween.forEach((id) => {
					const idType = this._controller.getIDType(id);
					if (idType === 'segment') {
						this._selectedSegments.push(id);
						this._editor.selectSegment(id, true);
					}
				});
				break;

			case this.selectModes.POINT: 
				if (!(this._polygonselectMode === 'segment') || this._selectedSegments.length !== 1) {
					this.unSelect();
				} else {
					const segmentID = this._selectedSegments[0];
					const inbetween = this._editor.getPointsBetweenPoints(pointA, pointB, segmentID);

					inbetween.forEach((point) => this._processSelectPoint(point, segmentID, false));
				}
				break;

			case this.selectModes.CHAR: 
		}

		this._polygonselectMode = 'segment';
		this.isSelecting = false;
	}

	getSelectedSegments() {
		return this._selectedSegments;
	}

	getSelectedPoints() {
		return this._selectedPoints;
	}

	getSelectedChars() {
		return this._selectedChars;
	}

	getSelectedPolygonType() {
		return this._typeLastSelected;
	}

	//***** private methods ****//
	// Handels if a point has to be selected or unselected
	_processSelectPoint(point, segmentID, toggle = true) {
		const selectIndex = this._selectedPoints.indexOf(point);
		if (selectIndex < 0 || !toggle) {
			// Has not been selected before => select
			if (point) {
				this._selectedPoints.push(point);
				this._editor.selectSegment(segmentID, true, false, point);
			}
		} else {
			// Has been selected before => unselect
			if (point) {
				this._selectedPoints.splice(selectIndex, 1);
				this._editor.selectSegment(segmentID, false, false, point);
			}
		}
	}

	// Handels if a segment has to be selected or unselected
	_processSelectSegment(segmentID) {
		const selectIndex = this._selectedSegments.indexOf(segmentID);
		if (selectIndex < 0) {
			// Has not been selected before => select
			this._selectedSegments.push(segmentID);
			this._editor.selectSegment(segmentID, true, false);
		} else {
			// Has been selected before => unselect
			this._selectedSegments.splice(selectIndex, 1);
			this._editor.selectSegment(segmentID, false, false);
		}
	}
}
