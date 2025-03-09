const multiSelectConfig = {
  init() {
    mobiscroll.setOptions({
      // locale,
      // theme
    });

    mobiscroll.select('#demo-multiple-select', {
      inputElement: document.getElementById('demo-multiple-select-input'),
    });
  },
  markup: `
<label>
    Multi-select
    <input mbsc-input id="demo-multiple-select-input" placeholder="Please select..." data-dropdown="true" data-input-style="outline" data-label-style="stacked" data-tags="true" />
</label>
<select id="demo-multiple-select" multiple>
    <option value="1">Books</option>
    <option value="2">Movies, Music & Games</option>
    <option value="3">Electronics & Computers</option>
    <option value="4">Home, Garden & Tools</option>
    <option value="5">Health & Beauty</option>
    <option value="6">Toys, Kids & Baby</option>
    <option value="7">Clothing & Jewelry</option>
    <option value="8">Sports & Outdoors</option>
</select>
  `,
};

export default multiSelectConfig;
