function carousel(items)
{
	/***************************
	* Default Parameter Values *
	***************************/
	var width = null,  // The width of the carousel.
		height = null,  // The height of the carousel.
		items = items  // The items to put in the carousel.
		;
	
	/*****************************
	* Carousel Creation Function *
	*****************************/
	function create(selection)
	{
		// Create the carousel. The selection passed in must contain only one element.
		if (selection.size() !== 1) { console.log("Selection to create carousel in must contain only one element."); return; }
		
		// Setup the carousel container.
		var carousel = selection.append("g").classed("carousel", true);
		
		// Transfer the items into the carousel from wherever they currently are.
		items.each(function()
			{
				carousel.node().appendChild(this);
			});
	}
	
	/**********************
	* Getters and Setters *
	**********************/
	// Carousel width.
	create.width = function(_)
	{
		if (!arguments.length) return width;
		width = _;
		return create;
	}
	
	// Carousel Height.
	create.height = function(_)
	{
		if (!arguments.length) return height;
		height = _;
		return create;
	}

	return create;
}