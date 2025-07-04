define([
    'jquery',
    'underscore',
    'knockout',
    'mage/translate',
    'Magento_PageBuilder/js/events',
    'Magento_PageBuilder/js/content-type/preview-collection',
    'Magento_PageBuilder/js/content-type-factory',
    'Magento_PageBuilder/js/config',
    'Magento_PageBuilder/js/content-type-menu/option',
    'mage/accordion',
], function ($, _, ko, $t, events, PreviewCollection, createContentType, pageBuilderConfig, option) {
    'use strict';

    /**
     * @param parent
     * @param config
     * @param stageId
     * @constructor
     */
    function Preview(parent, config, stageId) {
        PreviewCollection.call(this, parent, config, stageId);
    }

    Preview.prototype = Object.create(PreviewCollection.prototype);

    /**
     * Root element
     */
    Preview.prototype.element = null;

    Preview.prototype.initializeAccordionWidget = _.debounce(function () {
        if (this.element) {
            // Remove accordion if it's initialized, try/catch to handle case when accordion is not initialized
            try {
                $(this.element).accordion('destroy');
            } catch (e) {
            }
            $(this.element).accordion();
        }
    }, 10);

    /**
     * Bind events to add empty accordion item when accordion added and reinitialize accordion when accordion item added
     */
    Preview.prototype.bindEvents = function bindEvents() {
        var self = this;

        PreviewCollection.prototype.bindEvents.call(this);

        events.on("accordion:dropAfter", function (args) {
            if (args.id === self.contentType.id && self.contentType.children().length === 0) {
                self.addAccordionItem();
            }
        });

        events.on("accordion-item:renderAfter", (args) => {
            if (args.contentType.parentContentType.id === self.contentType.id) {
                this.initializeAccordionWidget();
            }
        });
    };

    /**
     * Add accordion item
     */
    Preview.prototype.addAccordionItem = function () {
        var self = this;
        createContentType(
            pageBuilderConfig.getContentTypeConfig("accordion-item"),
            this.contentType,
            this.contentType.stageId,
            // {
            //     title: $t("Title ") + (self.contentType.children().length + 1)
            // }
        ).then(function (container) {
            self.contentType.addChild(container);
        });
    };

    /**
     * Return content menu options
     *
     * @returns {object}
     */
    Preview.prototype.retrieveOptions = function () {
        var self = this;
        var options = PreviewCollection.prototype.retrieveOptions.call(this);

        options.add = new option({
            preview: this,
            icon: "<i class='icon-pagebuilder-add'></i>",
            title: "Add",
            action: self.addAccordionItem,
            classes: ["add-child"],
            sort: 10
        });
        return options;
    };

    /**
     * Set root element
     *
     * @returns {void}
     */
    Preview.prototype.afterRender = function (element) {
        this.element = element;
    };

    /**
     * Check if content type is container
     *
     * @returns {boolean}
     */
    Preview.prototype.isContainer = function () {
        return true;
    };

    return Preview;
});
