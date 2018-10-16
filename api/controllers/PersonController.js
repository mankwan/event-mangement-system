/**
 * PersonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // action - create
    create: async function (req, res) {

        if (req.method == "GET")
            return res.view('person/create');

        if (typeof req.body.Person === "undefined")
            return res.badRequest("Form-data not received.");

        await Person.create(req.body.Person);

        return res.ok("Successfully created!");
    },

    // action - index
    index: async function (req, res) {

        var models = await Person.find();
        return res.view('person/index', { persons: models });
        
    },

    // action - view
    view: async function (req, res) {

        var message = Person.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var model = await Person.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('person/view', { person: model });

    },

    // action - delete 
    delete: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        var message = Person.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var models = await Person.destroy(req.params.id).fetch();

        if (models.length == 0) return res.notFound();

        return res.ok("Person Deleted.");

    },

    // action - update
    update: async function (req, res) {

        var message = Person.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        if (req.method == "GET") {

            var model = await Person.findOne(req.params.id);

            if (!model) return res.notFound();

            return res.view('person/update', { person: model });

        } else {

            if (typeof req.body.Person === "undefined")
                return res.badRequest("Form-data not received.");

            var models = await Person.update(req.params.id).set({
                name: req.body.Person.name,
                age: req.body.Person.age
            }).fetch();

            if (models.length == 0) return res.notFound();

            return res.ok("Record updated");

        }
    },

    // search function
    search: async function (req, res) {

        const qName = req.query.name || "";
        const qAge = parseInt(req.query.age);

        if (isNaN(qAge)) {

            var models = await Person.find({
                where: { name: { contains: qName } },
                sort: 'name'
            });

        } else {

            var models = await Person.find({
                where: { name: { contains: qName }, age: qAge },
                sort: 'name'
            });

        }

        return res.view('person/index', { persons: models });
    },
};

