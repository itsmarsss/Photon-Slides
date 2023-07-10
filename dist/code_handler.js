
function update(text) {
    const result_element = document.getElementById("highlighting_content");

    result_element.textContent = text;
    Prism.highlightElement(result_element);
}

function check_tab(element, event) {
    let code = element.value;
    if (event.key == "Tab") {

        event.preventDefault();
        let before_tab = code.slice(0, element.selectionStart);
        let after_tab = code.slice(element.selectionEnd, element.value.length);
        let cursor_pos = element.selectionEnd + 1;
        element.value = before_tab + "\t" + after_tab;

        element.selectionStart = cursor_pos;
        element.selectionEnd = cursor_pos;
        update(element.value);
    }
}

function updateCode() {
    const textarea = document.getElementById("text_editor");
    const result_element = document.getElementById("highlighting_content");

    result_element.textContent = textarea.value;
    Prism.highlightElement(result_element);
}