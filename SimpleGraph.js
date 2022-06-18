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
		this.padding = 50;
		container.appendChild(this.svg);

		this.params = container.getBoundingClientRect();

		this.drawAxes();
	}

	drawAxes() {
		{
			let line = document.createElementNS(this.xmlns, "line");
			line.setAttributeNS(null, "x1", this.padding);
			line.setAttributeNS(null, "y1", 10);
			line.setAttributeNS(null, "x2", this.padding);
			line.setAttributeNS(null, "y2", this.params.height-10);
			line.setAttributeNS(null, "stroke", "black");
			this.svg.appendChild(line);
		}
		{
			let line = document.createElementNS(this.xmlns, "line");
			line.setAttributeNS(null, "x1", 10);
			line.setAttributeNS(null, "y1", this.params.height-this.padding);
			line.setAttributeNS(null, "x2", this.params.width-10);
			line.setAttributeNS(null, "y2", this.params.height-this.padding);
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

		this.grid_elements = [];

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
			let denominatorx = maxx-minx,
				denominatory = maxy-miny;

			for (let i=1; i<row.length; i++) {
				let line = document.createElementNS(this.xmlns, "line");
				line.setAttributeNS(null, "x1", this.padding+(this.params.width-this.padding*2)*(row[i-1][0]-minx)/denominatorx);
				line.setAttributeNS(null, "y1", this.params.height-(this.padding+(this.params.height-this.padding*2)*(row[i-1][1]-miny)/denominatory));
				line.setAttributeNS(null, "x2", this.padding+(this.params.width-this.padding*2)*(row[i][0]-minx)/denominatorx);
				line.setAttributeNS(null, "y2", this.params.height-(this.padding+(this.params.height-this.padding*2)*(row[i][1]-miny)/denominatory));
				line.setAttributeNS(null, "stroke", this.data[j]["color"]);
				line.setAttributeNS(null, "stroke-width", this.data[j]["width"]);
				let circle = document.createElementNS(this.xmlns, "circle");
				circle.setAttributeNS(null, "cx", this.padding+(this.params.width-this.padding*2)*(row[i][0]-minx)/denominatorx);
				circle.setAttributeNS(null, "cy", this.params.height-(this.padding+(this.params.height-this.padding*2)*(row[i][1]-miny)/denominatory));
				circle.setAttributeNS(null, "r", this.data[j]["width"]);
				circle.setAttributeNS(null, "fill", this.data[j]["color"]);

				let grid_line = document.createElementNS(this.xmlns, "line");
				grid_line.setAttributeNS(null, "x1", this.padding+(this.params.width-this.padding*2)*(row[i][0]-minx)/denominatorx);
				grid_line.setAttributeNS(null, "y1", this.params.height-(this.padding+(this.params.height-this.padding*2)*(row[i][1]-miny)/denominatory));
				grid_line.setAttributeNS(null, "x2", this.padding-10);
				grid_line.setAttributeNS(null, "y2", this.params.height-(this.padding+(this.params.height-this.padding*2)*(row[i][1]-miny)/denominatory));
				grid_line.setAttributeNS(null, "stroke", "rgba(0,0,0,.2)");

				this.grid_elements.push(grid_line);

				grid_line = document.createElementNS(this.xmlns, "line");
				grid_line.setAttributeNS(null, "x1", this.padding+(this.params.width-this.padding*2)*(row[i][0]-minx)/denominatorx);
				grid_line.setAttributeNS(null, "y1", this.params.height-(this.padding+(this.params.height-this.padding*2)*(row[i][1]-miny)/denominatory));
				grid_line.setAttributeNS(null, "x2", this.padding+(this.params.width-this.padding*2)*(row[i][0]-minx)/denominatorx);
				grid_line.setAttributeNS(null, "y2", this.params.height-(this.padding-10));
				grid_line.setAttributeNS(null, "stroke", "rgba(0,0,0,.2)");

				this.grid_elements.push(grid_line);

				let content = String(row[i][1]);
				let text = document.createElementNS(this.xmlns, "text");
				text.innerHTML = content;
				text.setAttributeNS(null, 'x', this.padding-content.length*this.fontSize);
				text.setAttributeNS(null, 'y', this.params.height-(this.padding+(this.params.height-this.padding*2)*(row[i][1]-miny)/denominatory));

				this.grid_elements.push(text);

				content = String(row[i][0]);
				text = document.createElementNS(this.xmlns, "text");
				text.innerHTML = content;
				text.setAttributeNS(null, 'x', this.padding+(this.params.width-this.padding*2)*(row[i][0]-minx)/denominatorx);
				text.setAttributeNS(null, 'y', this.params.height-(this.padding-this.fontSize));

				this.grid_elements.push(text);

				this.data_lines[j].push(line);
				this.data_lines[j].push(circle);
			}
		}

		for (let el of this.grid_elements) this.svg.appendChild(el);
		for (let row of this.data_lines) {
			for (let el of row) this.svg.appendChild(el);
		}
	}
}