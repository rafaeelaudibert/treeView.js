class treeView {

	/** @constructor */
	constructor(root, data, options) {

		if (root) {
			this.root = document.getElementById(root);

			// If there is no root, creates one
			if (this.root === null) {
				this.root = document.createElement('UL');
			}

			this.root.className += ' tree';
			this.root.id = 'tree';
		}

		this.data = data ? data : [];

		console.log(options);

		this.labels = options.statusLabels != undefined ? options.statusLabels : [];
		this.dataClass = options.dataClass != undefined ? options.dataClass : 'folder';
		this.hide = options.hide != undefined ? options.hide : true
		this.subTreeSignClosed = options.subTreeSignClosed != undefined ? options.subTreeSignClosed : '+'
		this.subTreeSignOpened = options.subTreeSignOpened != undefined ? options.subTreeSignOpened : '-'
		this.toggle = options.toggle != undefined ? options.toggle : true

	}

	createTree(root = this.root, data = this.data, hidden = false) {

		//For each object in the list
		for (let obj of data) {

			// Inserts the li
			const li = document.createElement('LI');
			root.append(li);

			// Inserts the li text, with it's class
			const span = document.createElement('span');
			span.innerHTML = obj.name;
			span.className += ` ${this.labels[obj.status]}`
			li.append(span);

			// If the object has children
			if (obj.data) {

				// Adds '+' after the text, and the folder class
				li.childNodes.forEach(node => {
					node.innerHTML += ` ${this.subTreeSignClosed}`;
					node.className += ` ${this.dataClass}`
				});

				// Creates the ul, appending it to the actual li
				const ul = document.createElement('UL');
				li.append(ul);

				// Inserts the children in the tree
				this.createTree(ul, obj.data, true);
			}

			// If chosen in the initialization, hides the submenus by default
			if (hidden && this.hide) {
				root.style.display = 'none';
			}
		}

		// Sets the toggle click event (folder opened or closed)
		this._toggleEvent(root)

		return this;

	}

	// Show the tree. If no parameter is passed, appends in the end of the HTML
	showTree(insertion) {
		this.root.style.display = 'block';
		insertion ? insertion.append(this.root) : document.body.append(this.root)

		return this;
	}

	hideTree() {
		this.root.style.display = 'none';

		return this;
	}

	_toggleEvent(root) {

		if (this.toggle) {
			for (const li of root.children) {

				const span = li.children[0]
				const ul = li.children[1]

				// Adding toggle option when clicking in a folder text
				span.onclick = (e) => {
					const display = ul.style.display
					const text = span.innerHTML

					// If hidden, show it and change the subTreeSign to the open status
					if (display === 'none') {
						ul.style.display = 'block'
						span.innerHTML = text.slice(0, text.length - this.subTreeSignClosed.length - 1) + ` ${this.subTreeSignOpened}`
					} else {
						ul.style.display = 'none'
						span.innerHTML = text.slice(0, text.length - this.subTreeSignOpened.length - 1) + ` ${this.subTreeSignClosed}`
					}
				}
			}
		}
	}

}
