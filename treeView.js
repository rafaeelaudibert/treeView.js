class treeView {

	/** @constructor */
	constructor(root, data, options = {}) {

		this.data = data ? data : [];
		this.labels = options.labels != undefined ? options.labels : [];
		this.dataClass = options.dataClass != undefined ? options.dataClass : 'folder';
		this.hide = options.hide != undefined ? options.hide : true
		this.subTreeSignClosed = options.subTreeSignClosed != undefined ? options.subTreeSignClosed : '+'
		this.subTreeSignOpened = options.subTreeSignOpened != undefined ? options.subTreeSignOpened : '-'
		this.toggle = options.toggle != undefined ? options.toggle : true
		this.warning = options.warning != undefined ? options.warning : true
		this.firstOpen = options.firstOpen != undefined ? options.firstOpen : false

		if (root) {
			this.root = document.getElementById(root);

			// If there is no root, creates one
			if (this.root === null) {
				this.root = document.createElement('UL');
				this.rootDOM = false;
				this._warn('We couldn\'t find the insertion point of the tree in the DOM.\n You must call showTree() passing the insertion point as a parameter to make it appear in your HTML');
			} else {
				this.rootDOM = true;
			}

			this.root.className += ' tree';
			this.root.id = 'tree';
		}

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
			span.className += `${this.labels[obj.status]} `
			li.append(span);

			// If the object has children
			if (obj.data) {

				// Adds '+' after the text, and the folder class
				li.childNodes.forEach(node => {
					node.innerHTML += ` ${this.subTreeSignClosed}`;
					node.className += `${this.dataClass}`
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
		this._toggleEvent(root);

		return this;

	}

	// Show the tree. If no parameter is passed, appends in the end of the HTML
	showTree(insertion) {
		this.root.style.display = 'block'; //Shows it

		if (!this.rootDOM || (insertion && insertion !== this.root)) {
			this.rootDOM = true;
			const newRoot = insertion ? insertion : document.body;
			newRoot.append(this.root);
			this.root = newRoot;
		}

		return this;
	}

	// Hides the tree from the view
	hideTree() {
		this.root.style.display = 'none';

		return this;
	}

	// Open all the tree branches
	expandTree() {
		document.querySelectorAll(`.${this.dataClass}`)
			.forEach(folder => {
				if (window.getComputedStyle(folder.nextElementSibling, null)
					.getPropertyValue('display') === 'none') {
					folder.click();
				}
			})

		return this;
	}


	// Closes all the tree branches
	closeTree() {
		document.querySelectorAll(`.${this.dataClass}`)
			.forEach(folder => {
				if (window.getComputedStyle(folder.nextElementSibling, null)
					.getPropertyValue('display') === 'block') {
					folder.click();
				}
			})

		return this;
	}

	setAction(e, action, id) {

		// Function which inserts the eventListener according to the action passed
		const func = (action, element) => {
			switch (action) {
				case 'close':
					element.addEventListener(e, () => {
						this.closeTree();
					});
					break;
				case 'expand':
					element.addEventListener(e, () => {
						this.expandTree();
					})
					break;
				case 'show':
					element.addEventListener(e, () => {
						this.showTree();
					});
					break;
				case 'hide':
					element.addEventListener(e, () => {
						this.hideTree();
					});
					break;
				default:
					this._error(`This action is not a valid one: ${action}`);
					break;
			};
		}

		// Ternary operator to see if we can add the eventListener or we must raise an error
		id ? func(action.toLowerCase(), document.getElementById(id)) : this._error(`You must pass a button id as a parameter to this function, but you passed: ${id}`);

		return this;

	}


	// PRIVATE METHOD
	_toggleEvent(root) {

		if (this.toggle) {
			for (const li of root.children) {

				const span = li.children[0]
				const ul = li.children[1]

				// Adding toggle option when clicking in a folder text
				span.onclick = (e) => {

					if (ul) { //So that it doesn't try to trigger in non-children lis
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

		if (this.firstOpen && root == this.root) {
			root.children[0].children[0].click();
		}
	}


	// DEBUG PRIVATE METHODS
	_log(logStr) {
		console.log('%c[treeView.js]', 'font-weight: bold; color: black; font-size: 15px', logStr);
	}

	_warn(warnStr) {
		if (this.warning) {
			console.warn('%c[treeView.js]', 'font-weight: bold; color: blue; font-size: 15px', warnStr);
		}
	}

	_error(errorStr) {
		throw new Error(errorStr, 'abc', 0);
	}

}
