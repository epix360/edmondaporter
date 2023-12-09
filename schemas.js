const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.postSchema = Joi.object({
    blogPost: Joi.object({
        title: Joi.string().required().escapeHTML(),
        content: Joi.string().required().escapeHTML(),
        image: Joi.string().optional().allow(null, '').escapeHTML(),
        imageIds: Joi.array().items(Joi.string()).optional().allow(null, '')
    }).required()
});

module.exports.profileSchema = Joi.object({
    profile: Joi.object({
        name: Joi.string().required().escapeHTML(),
        pname: Joi.string().required().escapeHTML(),
        bio: Joi.string().optional().allow(null, '').escapeHTML(),
        blogPosts: Joi.string().optional().allow(null, '').escapeHTML()
    }).required()
});

module.exports.publicationSchema = Joi.object({
    publication: Joi.object({
        content: Joi.string().required().escapeHTML(),
        imageIds: Joi.array().items(Joi.string()).optional().allow(null, '')
    }).required()
});

module.exports.linkSchema = Joi.object({
    link: Joi.object({
        content: Joi.string().required().escapeHTML(),
        imageIds: Joi.array().items(Joi.string()).optional().allow(null, '')
    }).required()
});

module.exports.homeSchema = Joi.object({
    home: Joi.object({
        heading: Joi.string().required().escapeHTML(),
        content: Joi.string().required().escapeHTML(),
        imageIds: Joi.array().items(Joi.string()).optional().allow(null, '')
    }).required()
});