
function load() {
	var frag = document.createDocumentFragment();
	for(var x = 0; x < 10; x++) {
		var li = document.createElement("li");
		li.innerHTML = "List item " + x;
		frag.appendChild(li);
	}
	let listNode = document.getElementById("list");
	listNode.appendChild(frag);
}

function load2() {
	var frag = document.createDocumentFragment();
	var div = document.createElement("div");
	div.innerHTML = `<p>Hej</p>`;
	frag.appendChild(div);
	//frag.innerHTML = `<div><p>Hej</p></div>`;

	div = document.getElementById("content");
	div.appendChild(frag);
}
window.addEventListener('load', () => {
	load();
	load2();
});
