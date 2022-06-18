class SimpleGraph {
	constructor(container) {
		this.container = container;
		this.xmlns = "http://www.w3.org/2000/svg";
		this.svg = document.createElementNS(this.xmlns, "svg");
		this.svg.style.width = "100%";
		this.svg.style.height = "100%";
		this.svg.style.fontFamily = "monospace";
		this.svg.style.fontSize = "13px";
		this.fontSize = 13;
		this.grid = false;
		this.data = [];
		this.data_lines = [];
		this.grid_elements = [];
		// this.padding = 70;
		this.paddingY = 70;
		this.paddingX = 150;
		// this.points = [];
		this.points_elements = [];
		this.vlines = [];
		this.hlines = [];
		container.appendChild(this.svg);

		this.params = container.getBoundingClientRect();

		this.drawAxes();

		this.xRounding = (value) => Math.floor(value*10)/10;
		this.yRounding = (value) => Math.floor(value*10000)/10000;
	}

	setXRounding(func) { this.xRounding = func; }
	setYRounding(func) { this.yRounding = func; }

	setGrid(flag) { this.grid = flag; }

	drawAxes() {
		{
			let line = document.createElementNS(this.xmlns, "line");
			line.setAttributeNS(null, "x1", this.paddingX);
			line.setAttributeNS(null, "y1", 10);
			line.setAttributeNS(null, "x2", this.paddingX);
			line.setAttributeNS(null, "y2", this.params.height-10);
			line.setAttributeNS(null, "stroke", "black");
			this.svg.appendChild(line);
		}
		{
			let line = document.createElementNS(this.xmlns, "line");
			line.setAttributeNS(null, "x1", 10);
			line.setAttributeNS(null, "y1", this.params.height-this.paddingY);
			line.setAttributeNS(null, "x2", this.params.width-10);
			line.setAttributeNS(null, "y2", this.params.height-this.paddingY);
			line.setAttributeNS(null, "stroke", "black");
			this.svg.appendChild(line);
		}
	}

	update() {
		for (let row of this.data_lines) {
			for (let el of row) el.remove();
		}

		this.data_lines = [];

		for (let el of this.grid_elements) el.remove();

		for (let el of this.points_elements) el.remove();

		this.grid_elements = [];

		let ys = [];

		for (let j=0; j<this.data.length; j++) {
			this.data_lines.push([]);
			let row = this.data[j]["data"];
			let minx = 1000000, maxx = 0,
				miny = 1000000, maxy = 0;
			for (let i=0; i<row.length; i++) {
				if (minx > row[i][0]) { minx = row[i][0]; }
				if (maxx < row[i][0]) { maxx = row[i][0]; }
				if (miny > row[i][1]) { miny = row[i][1]; }
				if (maxy < row[i][1]) { maxy = row[i][1]; }
			}
			if (this.data[j]["points"]) {
				row = this.data[j]["points"];
				for (let i=0; i<row.length; i++) {
					if (minx > row[i][0]) { minx = row[i][0]; }
					if (maxx < row[i][0]) { maxx = row[i][0]; }
					if (miny > row[i][1]) { miny = row[i][1]; }
					if (maxy < row[i][1]) { maxy = row[i][1]; }
				}
			}
			if (this.data[j]["vlines"]) {
				row = this.data[j]["vlines"];
				for (let i=0; i<row.length; i++) {
					if (minx > row[i][0]) { minx = row[i][0]; }
					if (maxx < row[i][0]) { maxx = row[i][0]; }
					if (miny > row[i][1]) { miny = row[i][1]; }
					if (maxy < row[i][1]) { maxy = row[i][1]; }
					if (miny > row[i][2]) { miny = row[i][2]; }
					if (maxy < row[i][2]) { maxy = row[i][2]; }
				}
			}
			if (this.data[j]["hlines"]) {
				row = this.data[j]["hlines"];
				for (let i=0; i<row.length; i++) {
					if (miny > row[i][0]) { miny = row[i][0]; }
					if (maxy < row[i][0]) { maxy = row[i][0]; }
					if (minx > row[i][1]) { minx = row[i][1]; }
					if (maxx < row[i][1]) { maxx = row[i][1]; }
					if (minx > row[i][2]) { minx = row[i][2]; }
					if (maxx < row[i][2]) { maxx = row[i][2]; }
				}
			}
			let denominatorx = maxx-minx,
				denominatory = maxy-miny;

			row = this.data[j]["data"];
			for (let i=1; i<row.length; i++) {
				let line = document.createElementNS(this.xmlns, "line");
				line.setAttributeNS(null, "x1", this.paddingX+(this.params.width-this.paddingX*2)*(row[i-1][0]-minx)/denominatorx);
				line.setAttributeNS(null, "y1", this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i-1][1]-miny)/denominatory));
				line.setAttributeNS(null, "x2", this.paddingX+(this.params.width-this.paddingX*2)*(row[i][0]-minx)/denominatorx);
				line.setAttributeNS(null, "y2", this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory));
				line.setAttributeNS(null, "stroke", this.data[j]["color"]);
				line.setAttributeNS(null, "stroke-width", this.data[j]["width"]);
				let circle = document.createElementNS(this.xmlns, "circle");
				circle.setAttributeNS(null, "cx", this.paddingX+(this.params.width-this.paddingX*2)*(row[i][0]-minx)/denominatorx);
				circle.setAttributeNS(null, "cy", this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory));
				circle.setAttributeNS(null, "r", this.data[j]["width"]);
				circle.setAttributeNS(null, "fill", this.data[j]["color"]);

				if (this.grid) {
					let grid_line = document.createElementNS(this.xmlns, "line");
					grid_line.setAttributeNS(null, "x1", this.paddingX+(this.params.width-this.paddingX*2)*(row[i][0]-minx)/denominatorx);
					grid_line.setAttributeNS(null, "y1", this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory));
					grid_line.setAttributeNS(null, "x2", this.paddingX-10);
					grid_line.setAttributeNS(null, "y2", this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory));
					grid_line.setAttributeNS(null, "stroke", "rgba(0,0,0,.2)");

					this.grid_elements.push(grid_line);

					grid_line = document.createElementNS(this.xmlns, "line");
					grid_line.setAttributeNS(null, "x1", this.paddingX+(this.params.width-this.paddingX*2)*(row[i][0]-minx)/denominatorx);
					grid_line.setAttributeNS(null, "y1", this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory));
					grid_line.setAttributeNS(null, "x2", this.paddingX+(this.params.width-this.paddingX*2)*(row[i][0]-minx)/denominatorx);
					grid_line.setAttributeNS(null, "y2", this.params.height-(this.paddingY-10));
					grid_line.setAttributeNS(null, "stroke", "rgba(0,0,0,.2)");

					this.grid_elements.push(grid_line);
				}

				let content = String(this.yRounding(row[i][1]));
				let text = document.createElementNS(this.xmlns, "text");
				text.innerHTML = content;
				text.setAttributeNS(null, 'x', this.paddingX-this.fontSize*content.length*0.60-10);
				text.setAttributeNS(null, 'y', this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory));
				text.setAttributeNS(null, 'textLength', this.fontSize*content.length*0.60);

				let current_y = this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory),
					flag = false;

				for (let yi=0; yi<ys.length; yi++) {
					if (Math.abs(ys[yi]-current_y) < this.fontSize) {
						flag = true;
						break;
					}
				}

				if (!flag) {
					ys.push(current_y);
					this.grid_elements.push(text);
				}

				content = String(this.xRounding(row[i][0]));
				text = document.createElementNS(this.xmlns, "text");
				text.innerHTML = content;
				text.setAttributeNS(null, 'x', this.paddingX+(this.params.width-this.paddingX*2)*(row[i][0]-minx)/denominatorx);
				text.setAttributeNS(null, 'y', this.params.height-(this.paddingY-this.fontSize));

				this.grid_elements.push(text);

				this.data_lines[j].push(line);
				this.data_lines[j].push(circle);
			}

			if (this.data[j]["points"]) {
				row = this.data[j]["points"];
				for (let i=0; i<row.length; i++) {
					let circle = document.createElementNS(this.xmlns, "circle");
					circle.setAttributeNS(null, "cx", this.paddingX+(this.params.width-this.paddingX*2)*(row[i][0]-minx)/denominatorx);
					circle.setAttributeNS(null, "cy", this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory));
					circle.setAttributeNS(null, "r", this.data[j]["width"]);
					circle.setAttributeNS(null, "fill", row[i][2]);
					console.log(circle);

					this.data_lines[j].push(circle);

					if (this.grid) {
						let grid_line = document.createElementNS(this.xmlns, "line");
						grid_line.setAttributeNS(null, "x1", this.paddingX+(this.params.width-this.paddingX*2)*(row[i][0]-minx)/denominatorx);
						grid_line.setAttributeNS(null, "y1", this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory));
						grid_line.setAttributeNS(null, "x2", this.paddingX-10);
						grid_line.setAttributeNS(null, "y2", this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory));
						grid_line.setAttributeNS(null, "stroke", "rgba(0,0,0,.2)");

						this.grid_elements.push(grid_line);

						grid_line = document.createElementNS(this.xmlns, "line");
						grid_line.setAttributeNS(null, "x1", this.paddingX+(this.params.width-this.paddingX*2)*(row[i][0]-minx)/denominatorx);
						grid_line.setAttributeNS(null, "y1", this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory));
						grid_line.setAttributeNS(null, "x2", this.paddingX+(this.params.width-this.paddingX*2)*(row[i][0]-minx)/denominatorx);
						grid_line.setAttributeNS(null, "y2", this.params.height-(this.paddingY-10));
						grid_line.setAttributeNS(null, "stroke", "rgba(0,0,0,.2)");

						this.grid_elements.push(grid_line);
					}

					let content = String(this.yRounding(row[i][1]));
					let text = document.createElementNS(this.xmlns, "text");
					text.innerHTML = content;
					text.setAttributeNS(null, 'x', this.paddingX-this.fontSize*content.length*0.60-10);
					text.setAttributeNS(null, 'y', this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory));
					text.setAttributeNS(null, 'textLength', this.fontSize*content.length*0.60);

					let current_y = this.params.height-(this.paddingY+(this.params.height-this.paddingY*2)*(row[i][1]-miny)/denominatory),
						flag = false;

					for (let yi=0; yi<ys.length; yi++) {
						if (Math.abs(ys[yi]-current_y) < this.fontSize) {
							flag = true;
							break;
						}
					}

					if (!flag) {
						ys.push(current_y);
						this.grid_elements.push(text);
					}

					content = String(this.xRounding(row[i][0]));
					text = document.createElementNS(this.xmlns, "text");
					text.innerHTML = content;
					text.setAttributeNS(null, 'x', this.paddingX+(this.params.width-this.paddingX*2)*(row[i][0]-minx)/denominatorx);
					text.setAttributeNS(null, 'y', this.params.height-(this.paddingY-this.fontSize));

					this.grid_elements.push(text);
				}
			}
		}

		for (let el of this.grid_elements) this.svg.appendChild(el);
		for (let row of this.data_lines) {
			for (let el of row) this.svg.appendChild(el);
		}

		// for (let point of this.points) {
		// 	this.drawPoint(point);
		// }
	}
}
