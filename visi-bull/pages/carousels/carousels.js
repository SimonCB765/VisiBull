function carousel(items)
{
	/***************************
	* Default Parameter Values *
	***************************/
	var width = null,  // The width of the carousel.
		height = null,  // The height of the carousel.
		xLoc = 0,  // The X coordinate within its container of the top right corner of the carousel.
		yLoc = 0,  // The Y coordinate within its container of the top right corner of the carousel.
		items = items,  // The items to put in the carousel.
		itemsToShow = 2,  // The number of items to show in the carousel. Can't be less than 1.
		itemsToScrollBy = 2,  // The number of items to scroll by in the carousel. Can't be less than 1.
		isInfinite = false,  // Whether the scrolling should be an infinite loop.
		isCentered = false,  // Whether the displayed items should be centered.
		isDots = false,  // Whether to display dots below the items to indicate where you are in the carousel.
		isArrows = true  // Whether to display arrows at the sides of the carousel that scroll the carousel when clicked.
		;
	
	/*****************************
	* Carousel Creation Function *
	*****************************/
	function create(selection)
	{
		// Create the carousel. The selection passed in must contain only one element.
		if (selection.size() !== 1) { console.log("Selection to create carousel in must contain only one element."); return; }
		
		// Setup the carousel container.
		var carousel = selection.append("g")
			.classed("carousel", true)
			.attr("transform", function(d) { return "translate(" + xLoc + "," + yLoc + ")"; });
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
	
	// Carousel height.
	create.height = function(_)
	{
		if (!arguments.length) return height;
		height = _;
		return create;
	}
	
	// Carousel X location.
	create.xLoc = function(_)
	{
		if (!arguments.length) return xLoc;
		xLoc = _;
		return create;
	}
	
	// Carousel Y location.
	create.yLoc = function(_)
	{
		if (!arguments.length) return yLoc;
		yLoc = _;
		return create;
	}
	
	// Items to show.
	create.itemsToShow = function(_)
	{
		if (!arguments.length) return itemsToShow;
		itemsToShow = _;
		return create;
	}
	
	// Items to scroll by.
	create.itemsToScrollBy = function(_)
	{
		if (!arguments.length) return itemsToScrollBy;
		itemsToScrollBy = _;
		return create;
	}
	
	// Infinite scrolling.
	create.isInfinite = function(_)
	{
		if (!arguments.length) return isInfinite;
		isInfinite = _;
		return create;
	}
	
	// Centered items.
	create.isCentered = function(_)
	{
		if (!arguments.length) return isCentered;
		isCentered = _;
		return create;
	}
	
	// Navigation dots.
	create.isDots = function(_)
	{
		if (!arguments.length) return isDots;
		isDots = _;
		return create;
	}
	
	// Navigation arrows.
	create.isArrows = function(_)
	{
		if (!arguments.length) return isArrows;
		isArrows = _;
		return create;
	}

	return create;
}