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
        isArrows = true,  // Whether to display arrows at the sides of the carousel that scroll the carousel when clicked.
        dotContainerHeight = 20  // The height of the g element containing the navigation dots. Should be at least twice the dotRadius.
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

        // Determine the width of each item (taking into account its padding), and the maximum height of all items.
        var maxItemHeight = 0;  // The maximum height of all the items.
        var itemWidths = [];  // The width + padding for all the items. The total width of the item with index i is found at index i in this array.
        var itemData = items.data();
        var currentItemData;
        for (var i = 0; i < itemData.length; i++)
        {
            currentItemData = itemData[i];
            maxItemHeight = Math.max(maxItemHeight, currentItemData.height);
            itemWidths.push(currentItemData.width + currentItemData.padding);
        }

        // Determine the necessary height and width of the carousel. If they're not specified, then they are set dynamically to fit the
        // items in carousel. The height will be set to the value that accommodates the tallest item, while the width will be set in order to
        // accommodate the itemsToShow widest adjacent items (taking into account width and horizontal padding).
        if (width === null)
        {
            // The width was not pre-specified, so set it dynamically.
            var maxWidthWindow = 0;
            for (var i = 0; i < itemWidths.length - (itemsToShow - 1); i++)
            {
                maxWidthWindow = Math.max(maxWidthWindow, d3.sum(itemWidths.slice(i, i + itemsToShow)));
            }
            width = maxWidthWindow;
        }
        if (height === null)
        {
            // The width was not pre-specified, so set it dynamically.
            height = maxItemHeight + (isDots ? dotContainerHeight : 0);
        }

        // Create the backing rectangle to catch events. Create it before transferring the items in order to ensure it is below them.
        carousel.append("rect")
            .classed("backingRect", true)
            .attr("width", width)
            .attr("height", height);

        // Transfer the items into the carousel from wherever they currently are.
        items.each(function() { carousel.node().appendChild(this); });

        // Determine the visible sets of items.
        var visibleItemSets = determine_visible_item_sets();


        function determine_visible_item_sets()
        {
            // Depending on the number of items and the values of itemsToShow and itemsToScrollBy, there will be a certain number of sets of items
            // that can be made visible when scrolling through the carousel. For example, with 8 items, 2 itemsToShow and 2 itemsToScrollBy, there are
            // 4 sets of items that can be visible at any one time (indices [0,1], [2,3], [4,5] and [6,7]).

            var itemsInCarousel = items[0].length;  // The number of items in the carousel.
            var keys = [];  // The keys of the items, ordered in the same order as the items were passed in.
            items.each(function(d) { keys.push(d.key); });
            var visibleSets = [keys.slice(0, itemsToShow)];  // The visible sets of items that can appear in the carousel's view.
            var startKey = keys[0];  // The key of the leftmost item in the initial view.
            var currentIndex = itemsToScrollBy;  // The index of the current leftmost item in the view being determined.
            var currentKey = keys[currentIndex];  // The key of the current leftmost item in the view being determined.
            var currentViewSet;  // An array containing the items in the current view being determined.
            if (isInfinite)
            {
                // If the scrolling is infinite, then the possible view sets can involve wrapping around the end of the array of items and starting
                // again from the beginning. Therefore, the view sets only stop when the first item in the next viewset is the same as the first
                // item in the first view set, as you've now reached the beginning of the cycle again.

                while (currentKey !== startKey)
                {
                    // Loop until the currentKey is the same as the starting one, and therefore until all possible views have been determined.
                    // This may require going past the end of the key array, and starting to gather keys from the beginning possibly multiple times
                    // if the itemsToScrollBy is really large).

                    currentViewSet = keys.slice(currentIndex, currentIndex + itemsToShow);  // The items at the end of the key array that are in the new view.

                    // Determine if more keys are needed than there are spots in the array to the right of the currentIndex. If more are needed, then loop back
                    // to the start of the key array to get them. Keep looping back until the required number of keys are acquired.
                    var keysNeeded = itemsToShow - currentViewSet.length;
                    while (keysNeeded > 0)
                    {
                        currentViewSet = currentViewSet.concat((keys.slice(0, keysNeeded)));  // Add the new items to the array containing the keys in this visible set.
                        keysNeeded = itemsToShow - currentViewSet.length;  // Update the number of keys that are still needed.
                    }
                    visibleSets.push(currentViewSet);  // Update the array of visible sets.

                    currentIndex = (currentIndex + itemsToScrollBy) % itemsInCarousel;  // Update the current index.
                    currentKey = keys[currentIndex];  // Update the current key.
                }
            }
            else
            {
                // If the scrolling is not infinite, then only need to get all sets up to the end of the item array. The problem comes when the number
                // of items and the number to scroll by don't match up nicely. For example, with 9 items, 2 itemsToShow and 3 itemsToScrollBy, you would
                // have view sets of indices [0,1], [3,4], [6,7], and then a left over index 8. In order to handle this, when there is a left over that is
                // smaller than a full view set, you just pad it with previous items. So, in the previous example, the final view set is not [8], but [7,8].

                for (var i = 0; i < Math.floor(itemsInCarousel / itemsToScrollBy); i++)
                {
                    visibleSets.push(keys.slice(i * itemsToScrollBy, (i * itemsToScrollBy) + itemsToShow));
                }
                if (Math.floor(itemsInCarousel / itemsToScrollBy) !== (itemsInCarousel / itemsToScrollBy))
                {
                    visibleSets.push(keys.slice(-itemsToShow));
                }
            }

            return visibleSets;
        }
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

    // Navigation dot container height.
    create.dotContainerHeight = function(_)
    {
        if (!arguments.length) return dotContainerHeight;
        dotContainerHeight = _;
        return create;
    }

    return create;
}