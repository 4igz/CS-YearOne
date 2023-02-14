var Style;
(function (Style) {
    Style["Title"] = "Title";
    Style["HeadingWithText"] = "HeadingWithText";
    Style["Form"] = "Form";
})(Style || (Style = {}));
;
const PAGES = [
    [Style.HeadingWithText, "Western Kayak Adventures", "Western Kayak Adventures was founded in 1993 by Don Gosselin. Join us in our ten years of operation as we explore the Pacific coast from Alaska to Mexico. We offer a variety of kayak tours and packages to suit everyone's needs from beginner to advanced. We take very seriously our commitment to providing you with an exciting and memorable kayaking adventure. Our fleet of kayaks is modern, stable, recreational boats which are easy to handle, allowing the paddler, you'll feel comfortable and secure throughout the tour. Both single and double equipped kayaks are available."],
    [Style.HeadingWithText, "Sea Kayak Experts", "Paddling a sea kayak is easy to learn, comfortable, and provides you with a quiet and unobtrusive vehicle for viewing wildlife closely, ranging from gray whales and blue-footed boobies, to orcas and bald eagles. Our tow-person kayaks are amazingly stable and sturdy craft, requiring absolutely no previous experience. Whether you're looking for a whale watching trip in Baja or a wilderness kayaking adventure in Alaska, we hope you'll join us.\nOur Experienced guides will take you to isolated locations where you can view whales, sea otters, sea lions, and other wildlife in their natural habitat. You will feel the timeless pull of the tide and current as you dip your paddle in the water and experience nature at its best!"],
    [Style.HeadingWithText, "Winter Escape", "Head for warm, sunny Mexico and join one of our Baja sea kayaking expeditions. Spend a warm week on our Sea of Cortez kayak trip with blue whales, playful dolphins, and tropical fish in this kayaker's paradise. In February and March you can observe gray whales and kayak he sheltered waters of Baja's beautiful Magdalena Bay on our Pacific Lagoon expedition. We have snorkeling equipment and wetsuits available for rent."],
    [Style.HeadingWithText, "Northern Adventure", "Travel north to Alaska's LeConte Glacier Bay, a 12 mile-long fjord carved out of the coastal mountain range by glaciers over the course of thousands of years. LeConte Glacier is North America's southernmost tidewater glacier and can be viewed from a kayak after paddling by awe-inspiring icebergs. We will take day trips from camp through the bay and see spruce and hemlock old growth forests give way to shear 3000 foot rock walls that have been ground smooth by glacier ice. You'll see thundering waterfalls, crystal-clear and bright blue icebergs and curios harbor seals swimming nearby."],
    [Style.HeadingWithText, "Adventure Costs", "Cost per person: $1,575, not including airfare. A $200/person deposit is required 30 days prior to your kayaking adventure, with the balance due 5 days prior to your departure date. You will need to provide your own sleeping bag and person items (we will provide you with a packing list). Western Kayak Adventures will provide you with a kayak and the camping gear you need for your adventure."],
    [Style.HeadingWithText, "Contact Us", "Western Kayak Adventures\n1234 Glacier Parkway\nLeConte Glacier Bay, AK 99720\n(907) 555-1212\nkayakadventures@gmail.com"],
    [Style.Form, "Request Information", "Your Email", "Subject", "Message"],
];
const PAGE_IMAGE_ADDITIONS = {
    "0": ["res/welcome.gif"],
    "1": ["res/sea-kayak.jpg"],
    "2": ["res/kayak_cabin.jpg"],
    "3": ["res/kayak_snow.jpg"],
    "4": ["res/kayak_rental.jpg"],
    "5": ["res/kayak-menorca-jpg-224.jpg"],
};
function newPage(props, id) {
    // The page itself:
    var div = document.createElement("div");
    div.className = "section-content";
    document.getElementById("container").appendChild(div);
    // Page functional settings:
    var elements = newComponent(props.shift(), props);
    elements.forEach((element) => {
        div.appendChild(element);
    });
    return div;
}
;
// Fetch the component and call the function associated with that style.
// Returns all associated elements to be fit into a section div.
function newComponent(style, props) {
    return COMPONENTS[style](props);
}
;
// I use a Look-Up-Table to reduce code duplication
const COMPONENTS = {
    [Style.Title]: title,
    [Style.HeadingWithText]: headingWithText,
    [Style.Form]: form,
};
function title(props) {
    var heading = document.createElement("h1");
    var headingText = props.shift();
    heading.style.fontFamily = "Century Gothic,CenturyGothic,AppleGothic,sans-serif";
    heading.innerText = headingText;
    document.body.appendChild(heading);
    return [heading];
}
;
function headingWithText(props) {
    var heading = document.createElement("h1");
    var headingText = props.shift();
    heading.style.fontFamily = "Century Gothic,CenturyGothic,AppleGothic,sans-serif";
    heading.innerText = headingText;
    document.body.appendChild(heading);
    var body = document.createElement("p1");
    var bodyText = props.shift();
    body.style.fontFamily = "Roboto,sans-serif";
    body.innerText = bodyText;
    document.body.appendChild(body);
    return [heading, body];
}
;
function form(props) {
    var heading = document.createElement("h1");
    document.body.appendChild(heading);
    return [heading];
}
;
PAGES.forEach((page, idx) => {
    var div = newPage(page, idx.toString());
    var additions = PAGE_IMAGE_ADDITIONS[idx.toString()];
    if (additions) {
        additions.forEach((path) => {
            var img = document.createElement("img");
            img.src = path;
            img.style.scale = "50%";
            div.appendChild(img);
        });
    }
});
