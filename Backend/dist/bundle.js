/******/(()=>{// webpackBootstrap
/******/"use strict";
/******/var e={
/***/14:
/***/function(e,t,r){var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.clearDatabase=t.closeDatabase=t.connect=void 0;
// Copyright: This script is taken from: https://codesandbox.io/s/typescript-forked-8vscow?file=/src/db.ts
const s=i(r(185)),a=r(725);let n;t.connect=async()=>{n=await a.MongoMemoryServer.create();const e=n.getUri();await s.default.connect(e,{dbName:"ConnectAndExplore"}).then((e=>console.log("connected...."))).catch((e=>console.log(`Cannot connect => ${e}`)))};t.closeDatabase=async()=>{await s.default.connection.dropDatabase(),await s.default.connection.close(),await n.stop()};t.clearDatabase=async()=>{const e=s.default.connection.collections;for(const t in e){const r=e[t];await r.deleteMany({})}}},
/***/505:
/***/function(e,t,r){var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=i(r(860)),a=r(986),n=r(231),o=r(582),d=n.readFileSync("./certificates/key.pem"),c=n.readFileSync("./certificates/cert.pem"),u=r(14),l=i(r(993)),p=i(r(617)),m=(r(685),i(r(811))),h=i(r(79)),y=i(r(562)),g=i(r(11)),f=i(r(996)),w=(0,s.default)(),v=process.env.PORT||443;
/* Routes */
w.use("*",o()),w.use((function(e,t,r){t.header("Access-Control-Allow-Origin","*"),t.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept"),t.header("Access-Control-Expose-Headers","Authorization"),r()})),w.use(a.json()),w.use(s.default.urlencoded({extended:!0})),w.use(s.default.static(__dirname)),
// Health check endpoint
w.get("/health",((e,t)=>{t.status(200).send("Health Check: OK")})),w.use("/api/users",h.default),w.use("/api",y.default),w.use("/api/login",g.default),w.use("/api/events",f.default),(0,m.default)(w,+v),w.use(((e,t,r)=>{t.status(404).json("Not Found")})),(0,u.connect)().then((async()=>{
// Create admin user after connecting to the database
await(0,l.default)(),p.default.createServer({key:d,cert:c},w).listen(v,(()=>{console.log("Listening on port ",v)}))})).catch((e=>{console.error("Failed to connect to the database:",e)})),t.default=w},
/***/924:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Categoty=t.Event=void 0;const i=r(185),s=r(95),a=new i.Schema({name:{type:String,required:!0/* , unique: true */},description:{type:String}}),n=new i.Schema({name:{type:String,required:!0},creator:{type:i.Schema.Types.ObjectId,ref:"User",required:!0},description:{type:String,required:!0},price:{type:Number,required:!0,min:0},date:{type:Date,required:!0},address:s.addressSchema,thumbnail:{type:String},hashtags:[{type:String}],category:[a],chat:{type:i.Schema.Types.ObjectId,ref:"Chat",required:!0},participants:[{type:i.Schema.Types.ObjectId,ref:"User",required:!0}]});
/*
Zu implementieren?:
Middleware-Methode, die sicherstellt, dass nach Bearbeitung eines Events, alle Teilnehmer benachrichtigt werden

eventSchema.post('updateOne', async function (result, next) {
    try {
        //Funktion zur Benachrichtigung aller Teilnehmer
    } catch (error) {
        //throw new Error()
    }
    next();
}); */
t.Event=(0,i.model)("Event",n),t.Categoty=(0,i.model)("Category",a)}
/***/,
/***/95:
/***/function(e,t,r){var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.User=t.addressSchema=t.userRole=void 0;const s=r(185),a=i(r(432));var n;!function(e){e.User="u",e.Admin="a"}(n||(t.userRole=n={})),
/**
 * Adressen werden später in das UserSchema eingefügt und als teil eines Users in mongoDB gespeichert
 */
t.addressSchema=new s.Schema({street:{type:String,required:!0},houseNumber:{type:String,required:!0},apartmentNumber:String,postalCode:{type:String,required:!0},city:{type:String,required:!0},stateOrRegion:String,country:{type:String,required:!0}});const o=new s.Schema({email:{type:String,required:!0,unique:!0},name:{first:{type:String,required:!0},last:{type:String,required:!0}},password:{type:String,required:!0},isAdministrator:{type:Boolean,default:!1},address:t.addressSchema,profilePicture:String,birthDate:{type:Date,required:!0},gender:{type:String,required:!0},socialMediaUrls:{facebook:String,instagram:String},isActive:{type:Boolean,default:!0}});o.pre("save",(async function(){if(this.isModified("password")){const e=await a.default.hash(this.password,10);this.password=e}})),o.pre("updateOne",{document:!1,query:!0},(async function(){const e=this.getUpdate();if(null!=(null==e?void 0:e.password)){const t=await a.default.hash(e.password,10);e.password=t}})),o.method("isCorrectPassword",(async function(e){return await a.default.compare(e,this.password)})),t.User=(0,s.model)("User",o)},
/***/996:
/***/function(e,t,r){var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=i(r(860)),a=r(682),n=r(468),o=r(553),d=r(0),c=s.default.Router(),u=new a.EventService;
/**
 * @swagger
 * /api/events/search:
 *   get:
 *     summary: "Search for events"
 *     description: "Search events based on a query string"
 *     tags:
 *       - "Event"
 *     parameters:
 *       - name: "query"
 *         in: "query"
 *         required: true
 *         schema:
 *           type: "string"
 *         description: "The query string to search for events"
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/IEvent"
 *       204:
 *         description: "No events found matching the query"
 *       400:
 *         description: "Bad request. Validation error in the query string"
 *       404:
 *         description: "Not found. The requested resource does not exist"
 *       500:
 *         description: "Internal server error"
 */
c.get("/search",n.optionalAuthentication,[(0,o.query)("query").isString().notEmpty()],(async(e,t,r)=>{const i=(0,o.validationResult)(e);if(!i.isEmpty())return t.status(400).json({errors:i.array()});try{const r=e.query.query,i=await u.searchEvents(r);if(0===i.events.length)return t.status(204).json({message:"No events found matching the query."});t.status(200).send(i)}catch(e){t.status(404),r(e)}})),
/**
 * @swagger
 * paths:
 *  /api/events/create:
 *    post:
 *     summary: Create a new event
 *     description: Register a new event with event data and an optional event pictures.
 *     tags:
 *       - Event
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Test Event"
 *                price:
 *                  type: number
 *                  example: 0
 *                description:
 *                  type: string
 *                  example: "Test Event description"
 *                date:
 *                  type: string
 *                  format: date
 *                  example: "2000-01-01"
 *                address[street]:
 *                  type: string
 *                  example: "123 Test Street"
 *                address[houseNumber]:
 *                  type: string
 *                  example: "1"
 *                address[apartmentNumber]:
 *                  type: string
 *                  example: "123"
 *                address[postalCode]:
 *                  type: string
 *                  example: "12345"
 *                address[city]:
 *                  type: string
 *                  example: "Berlin"
 *                address[stateOrRegion]:
 *                  type: string
 *                  example: "Berlin"
 *                address[country]:
 *                  type: string
 *                  example: "DE"
 *                thumbnail:
 *                  type: string
 *                  example: []
 *                  format: binary
 *                hashtags:
 *                  type: array
 *                  items:
 *                    type: string
 *                  example: ["sport", "freizeit"]
 *                category:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                        example: "Hobbys"
 *                      description:
 *                        type: string
 *                        example: "persönliche Interessen, Freizeit"
 *              required:
 *                - name
 *                - price
 *                - description
 *                - date
 *                - name[first]
 *                - name[last]
 *                - address[street]
 *                - address[houseNumber]
 *                - address[postalCode]
 *                - address[city]
 *                - address[country]
 *                - category
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IEvent'
 *       400:
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request, validation error
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Creating new event failed
 */
c.post("/create",n.requiresAuthentication,d.upload.single("thumbnail"),[(0,o.body)("name").isString().notEmpty().withMessage("Event name is required."),
//body("creator").isString().notEmpty(),
(0,o.body)("price").isNumeric().notEmpty(),(0,o.body)("description").isString().notEmpty().withMessage("Description is required."),(0,o.body)("date")/* .isDate() */.notEmpty(),(0,o.body)("address.street").notEmpty().withMessage("Street address is required."),(0,o.body)("address.houseNumber").notEmpty().withMessage("House number is required."),(0,o.body)("address.postalCode").notEmpty().withMessage("Postal code is required."),(0,o.body)("address.city").notEmpty().withMessage("City is required."),(0,o.body)("address.country").notEmpty().withMessage("Country is required."),(0,o.body)("address.stateOrRegion").optional().isString().withMessage("Invalid State or Region."),(0,o.body)("address.apartmentNumber").optional().isString().withMessage("Invalid Apartment number."),(0,o.body)("thumbnail").optional().isString(),(0,o.body)("hashtags").optional().isArray(),(0,o.body)("category").isArray().notEmpty().withMessage("Categories are required.")],(async(e,t)=>{try{const r=(0,o.validationResult)(e);if(r.isEmpty()){e.file&&(e.body.thumbnail=`/uploads/events/${e.file.filename}`);const r=await u.createEvent(e.body,e.userId);return t.status(201).send(r)}return e.file&&
// Delete the file
(0,d.deleteEventThumbnail)(e.file.path),t.status(400).json({errors:r.array()})}catch(e){return t.status(500).json({Error:"Event creation failed"})}})),
/**
 * @swagger
 * /api/events/{eventid}/join:
 *   post:
 *     summary: "Join an event"
 *     deprecated: false
 *     description: "The User can join event"
 *     tags:
 *       - "Event"
 *     parameters:
 *       - name: "eventid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the event to join"
 *     responses:
 *       "200":
 *         description: "User joined the event successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties: {}
 *       "409":
 *         description: "User is already participating in the event"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "User is already participating in the event."
 *       "404":
 *         description: "Not Found - Invalid userID"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "No user or event with this ID exists."
 *       "500":
 *         description: "Joining event failed"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "Joining event failed"
 *     security:
 *       - bearerAuth: []
 */
c.post("/:eventid/join",n.requiresAuthentication,(0,o.param)("eventid").isMongoId(),(async(e,t,r)=>{try{await u.joinEvent(e.userId,e.params.eventid),t.status(200).json({message:"User joined the event successfully"})}catch(e){return"User not found"===e.message||"Event not found"===e.message?t.status(404).json({Error:e.message}):"User is already participating in the event"===e.message?t.status(409).json({Error:e.message}):t.status(500).json({Error:"Joining event failed"})}})),
/**
 * @swagger
 * /api/events/{eventid}/cancel:
 *   delete:
 *     summary: "Cancel participating in event"
 *     deprecated: false
 *     description: "Canceling of participating in event"
 *     tags:
 *       - "Event"
 *     parameters:
 *       - name: "eventid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the event to cancel participating in"
 *     responses:
 *       "204":
 *         description: "User canceled the participating in the event successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties: {}
 *       "409":
 *         description: "User is not participating in the event or Can not cancel participation as event manager"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "User is not participating in the event or Can not cancel participation as event manager"
 *       "500":
 *         description: "Canceling event failed"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "Canceling event failed"
 *     security:
 *       - bearerAuth: []
 */
c.delete("/:eventid/cancel",n.requiresAuthentication,(0,o.param)("eventid").isMongoId(),(async(e,t,r)=>{try{await u.cancelEvent(e.userId,e.params.eventid),t.status(204).send()}catch(e){return"User is not participating in the event"===e.message||"Can not cancel participation as event manager"===e.message?t.status(409).json({Error:e.message}):t.status(500).json({Error:"Canceling event failed"})}})),
/**
 * @swagger
 * /api/events/joined:
 *   get:
 *     summary: "Get all joined events"
 *     deprecated: false
 *     description: "Retrieve all participated events ( Event participant )"
 *     tags:
 *       - "Event"
 *     responses:
 *       '200':
 *         description: Returns all joined events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IEvent'
 *       '204':
 *         description: No events found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Not found
 *     security:
 *       - bearerAuth: []
 */
c.get("/joined",n.requiresAuthentication,(async(e,t,r)=>{try{const r=await u.getJoinedEvents(e.userId);if(0===r.events.length)return t.status(204).json({message:"No events found."});t.status(200).send(r)}catch(e){t.status(404),r(e)}})),
/**
 * @swagger
 * /api/events/{eventid}/participants:
 *   get:
 *     summary: "Retrieve all participants in event"
 *     deprecated: false
 *     description: "Retrieve a list of all participants in event"
 *     tags:
 *       - "Event"
 *     parameters:
 *       - name: "eventid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the event to cancel participating in"
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 type: "string"
 *                 description: "User ID of a participant"
 *       404:
 *         description: "Event not found or no participants found for the specified event"
 *       500:
 *         description: "Internal server error"
 */
c.get("/:eventid/participants",n.requiresAuthentication,(0,o.param)("eventid").isMongoId(),(async(e,t,r)=>{try{const r=await u.getParticipants(e.params.eventid,e.userId);t.status(200).send(r)}catch(e){t.status(404),r(e)}})),
/**
 * @swagger
 * /api/events/{eventid}:
 *   get:
 *     summary: "Retrieve information of an event"
 *     deprecated: false
 *     description: "Retrieve all data of Event with eventid"
 *     tags:
 *       - "Event"
 *     parameters:
 *       - name: "eventid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the event to retrieve the event data"
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties: {}
 *               $ref: '#/components/schemas/IEvent'
 *       400:
 *         description: "Validation error"
 *       404:
 *         description: "Event not found for the specified event"
 *       500:
 *         description: "Internal server error"
 */
c.get("/:eventid",n.optionalAuthentication,(0,o.param)("eventid").isMongoId(),(async(e,t,r)=>{const i=(0,o.validationResult)(e);if(!i.isEmpty())return t.status(400).json({errors:i.array()});try{const r=await u.getEvent(e.params.eventid);t.status(200).send(r)}catch(e){t.status(404),r(e)}})),c.put("/:eventid",n.requiresAuthentication,d.upload.single("thumbnail"),(0,o.param)("eventid").isMongoId(),(async(e,t,r)=>{const i=(0,o.validationResult)(e);if(!i.isEmpty())return e.file&&
// Delete the file
(0,d.deleteEventThumbnail)(e.file.path),t.status(400).json({errors:i.array()});try{const r=await u.getEvent(e.params.eventid);e.file&&(e.body.thumbnail=`/uploads/${e.file.filename}`,r.thumbnail&&(0,d.deleteEventThumbnail)(r.thumbnail));const i=e.body,s=await u.updateEvent(e.params.eventid,i,e.userId);t.status(200).send(s)}catch(i){(0,d.deleteEventThumbnail)(e.body.thumbnail),t.status(404),r(i)}})),
/**
 * @swagger
 * /api/events/{eventid}:
 *   delete:
 *     summary: "Delete event"
 *     deprecated: false
 *     description: "Deleting event with eventID as an event manager or admin"
 *     tags:
 *       - "Event"
 *     parameters:
 *       - name: "eventid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the event to delete"
 *     responses:
 *       "204":
 *         description: "Event successfully deleted"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties: {}
 *       "405":
 *         description: "Event could not be deleted"
 *       "404":
 *         description: "Event not found"
 *     security:
 *       - bearerAuth: []
 */
c.delete("/:eventid",n.requiresAuthentication,(0,o.param)("eventid").isMongoId(),(async(e,t,r)=>{try{const r=await u.getEvent(e.params.eventid),i=await u.deleteEvent(e.params.eventid,e.userId);r.thumbnail&&(0,d.deleteEventThumbnail)(r.thumbnail),i?t.status(204).json({message:"Event successfully deleted"}):t.status(405).json({error:"Event could not be deleted"})}catch(e){t.status(404),r(e)}})),
/**
 * @swagger
 * /api/events/creator/{userid}:
 *   get:
 *     summary: Get all created events of a user
 *     deprecated: false
 *     description: "Retrieve all events created by a user where the user is an admin or retrieve events associated with the authenticated user."
 *     tags:
 *       - Event
 *     parameters:
 *       - name: "userid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the user"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns all created events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IEvent'
 *       '204':
 *         description: No events found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '403':
 *         description: Invalid authorization
 *       '404':
 *         description: Not found
 */
c.get("/creator/:userid",n.requiresAuthentication,(0,o.param)("userid").isMongoId(),(async(e,t,r)=>{if("a"===e.role||e.params.userid===e.userId)try{const r=e.params.userid,i=await u.getEvents(r);if(0===i.events.length)return t.status(204).json({message:"No events found."});t.status(200).send(i)}catch(e){t.status(404),r(e)}else t.status(403),r(new Error("Invalid authorization"))})),
/**
 * @swagger
 * /api/events/:
 *   get:
 *     summary: Get all events
 *     tags:
 *       - Event
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns all events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IEvent'
 *       '204':
 *         description: No events found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Not found
 */
c.get("/",n.optionalAuthentication,(async(e,t,r)=>{try{const e=await u.getAllEvents();if(0===e.events.length)return t.status(204).json({message:"No events found."});t.status(200).send(e)}catch(e){t.status(404),r(e)}})),t.default=c},
/***/79:
/***/function(e,t,r){var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=i(r(860)),a=r(553),n=r(105),o=r(0),d=r(448),c=r(468),u=s.default.Router(),l=new n.UserService;
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with user data and an optional profile picture.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *              type: object
 *              properties:
 *                profilePicture:
 *                  type: string
 *                  example: []
 *                  format: binary
 *                email:
 *                  type: string
 *                  example: "John@doe.com"
 *                name[first]:
 *                  type: string
 *                  example: "Test"
 *                name[last]:
 *                  type: string
 *                  example: "User"
 *                password:
 *                  type: string
 *                  example: "12abcAB!"
 *                birthDate:
 *                  type: string
 *                  example: "2000-01-01"
 *                gender:
 *                  type: string
 *                  example: "Male"
 *                address[street]:
 *                  type: string
 *                  example: "123 Test Street"
 *                address[houseNumber]:
 *                  type: string
 *                  example: "1"
 *                address[apartmentNumber]:
 *                  type: string
 *                  example: "123"
 *                address[postalCode]:
 *                  type: string
 *                  example: "12345"
 *                address[city]:
 *                  type: string
 *                  example: "Berlin"
 *                address[stateOrRegion]:
 *                  type: string
 *                  example: "Berlin"
 *                address[country]:
 *                  type: string
 *                  example: "DE"
 *              required:
 *                - email
 *                - password
 *                - gender
 *                - birthDate
 *                - name[first]
 *                - name[last]
 *                - address[street]
 *                - address[houseNumber]
 *                - address[postalCode]
 *                - address[city]
 *                - address[country]
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IUser'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             example:
 *               error: User already exists
 *       500:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             example:
 *               error: Registration failed
 */
u.post("/register",o.upload.single("profilePicture"),[(0,a.body)("email").isEmail(),(0,a.body)("name.first").isString().isLength({min:3,max:100}).withMessage("First name is required."),(0,a.body)("name.last").isString().isLength({min:3,max:100}).withMessage("Last name is required."),(0,a.body)("password").isStrongPassword(),(0,a.body)("isAdministrator").optional().isBoolean(),(0,a.body)("address.street").notEmpty().withMessage("Street address is required."),(0,a.body)("address.houseNumber").notEmpty().withMessage("House number is required."),(0,a.body)("address.postalCode").notEmpty().withMessage("Postal code is required."),(0,a.body)("address.city").notEmpty().withMessage("City is required."),(0,a.body)("address.country").notEmpty().withMessage("Country is required."),(0,a.body)("address.stateOrRegion").optional().isString().withMessage("Invalid State or Region."),(0,a.body)("address.apartmentNumber").optional().isString().withMessage("Invalid Apartment number."),(0,a.body)("profilePicture").optional().isString(),(0,a.body)("birthDate").isDate(),(0,a.body)("gender").isString().notEmpty(),(0,a.body)("socialMediaUrls.facebook").optional().isString(),(0,a.body)("socialMediaUrls.instagram").optional().isString()],(async(e,t)=>{try{const r=(0,a.validationResult)(e);if(r.isEmpty()){e.file&&(e.body.profilePicture=`/uploads/users/${e.file.filename}`);const r=await l.registerUser(e.body);return t.status(201).json(r)}return e.file&&
// Delete the file
(0,o.deleteProfilePicture)(e.file.path),t.status(400).json({errors:r.array()})}catch(e){return"User already exists"===e.message?t.status(409).json({Error:"User already exists"}):t.status(500).json({Error:"Registration failed"})}})),
/**
 * @swagger
 * /api/users/{userid}:
 *   get:
 *     summary: "Get User"
 *     deprecated: false
 *     description: "Retrieve a user by ID"
 *     tags:
 *       - "User"
 *     parameters:
 *       - name: "userid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the user to retrieve"
 *     responses:
 *       "200":
 *         description: "OK"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties: {}
 *       "403":
 *         description: "Forbidden - Invalid authorization"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "Invalid authorization, cannot get User."
 *       "404":
 *         description: "Not Found - Invalid userID"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "No user with this ID exists."
 *     security:
 *       - bearerAuth: []
 */
u.get("/:userid",c.requiresAuthentication,(0,a.param)("userid").isMongoId(),(async(e,t,r)=>{const i=(0,a.validationResult)(e);if(!i.isEmpty())return t.status(400).json({errors:i.array()});const s=e.params.userid;if("a"!==e.role&&s!==e.userId)t.status(403),r(new Error("Invalid authorization, can not get User."));else try{const e=await l.getUser(s);t.status(200).json(e)}catch(e){t.status(404),r(e)}})),
/**
 * @swagger
 * /api/users/{userid}:
 *   put:
 *     summary: Update user details
 *     description: Update user details for a specific user.
 *     tags:
 *       - User
 *     parameters:
 *       - name: "userid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the user to update"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 example: []
 *                 format: binary
 *               email:
 *                 type: string
 *                 example: "John@doe.com"
 *               name[first]:
 *                     type: string
 *                     example: "Test"
 *               name[last]:
 *                     type: string
 *                     example: "User"
 *               password:
 *                 type: string
 *                 example: "12abcAB!12abcAB!"
 *               oldPassword:
 *                 type: string
 *                 example: "12abcAB!"
 *               birthDate:
 *                 type: string
 *                 example: "2000-01-01"
 *               gender:
 *                 type: string
 *                 example: "Male"
 *               address[street]:
 *                 type: string
 *                 example: "123 Test Street"
 *               address[houseNumber]:
 *                 type: string
 *                 example: "1"
 *               address[postalCode]:
 *                 type: string
 *                 example: "12345"
 *               address[city]:
 *                 type: string
 *                 example: "Berlin"
 *               address[country]:
 *                 type: string
 *                 example: "DE"
 *     responses:
 *       200:
 *         description: User details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IUser'
 *       403:
 *         description: Invalid authorization
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid authorization, cannot update user
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 *       500:
 *         description: Update failed
 *         content:
 *           application/json:
 *             example:
 *               error: Update failed
 */
u.put("/:userid",c.requiresAuthentication,o.upload.single("profilePicture"),[(0,a.param)("userid").isMongoId()],d.validate,(async(e,t,r)=>{const i=(0,a.validationResult)(e);if(!i.isEmpty())return e.file&&
// Delete the file
(0,o.deleteProfilePicture)(e.file.path),t.status(400).json({errors:i.array()});const s=e.params.userid;if("a"===e.role||s===e.userId){const r=await l.getUser(s);try{e.file&&(e.body.profilePicture=`/uploads/${e.file.filename}`,r.profilePicture&&(0,o.deleteProfilePicture)(r.profilePicture))}catch(r){(0,o.deleteProfilePicture)(e.body.profilePicture),t.status(404).json({Error:"Can not delete Profile picture - no such file or directory"})}}
//req.body.name = JSON.parse(req.body.name);
const n=e.body;//matchedData(req) as userResource;
if(n.id=s,"a"===e.role)try{const e=await l.updateUserWithAdmin(n);t.status(200).send(e)}catch(e){t.status(404),r(e)}else if(e.userId!==s)t.status(403),r(new Error("Invalid authorization, can not update user."));else try{let r;e.body.oldPassword&&(r=e.body.oldPassword);const i=await l.updateUserWithPw(n,r);t.status(200).send(i)}catch(e){t.status(403),r(new Error("Invalid authorization, probably invalid password."))}})),
/**
 * @swagger
 * /api/users/{userid}:
 *   delete:
 *     summary: "Delete User"
 *     deprecated: false
 *     description: "Delete a user by ID"
 *     tags:
 *       - "User"
 *     parameters:
 *       - name: "userid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the user to delete"
 *     responses:
 *       "204":
 *         description: "OK"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties: {}
 *       "403":
 *         description: "Forbidden - Invalid authorization"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "Invalid authorization, cannot delete user."
 *       "404":
 *         description: "Not Found - Probably invalid userid"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "Probably invalid userid, cannot delete user."
 *     security:
 *       - bearerAuth: []
 */
u.delete("/:userid",c.requiresAuthentication,(0,a.param)("userid").isMongoId(),(async(e,t,r)=>{const i=e.params.userid;try{if("a"===e.role){const e=await l.getUser(i),r=await l.deleteUser(i,!1);try{e.profilePicture&&(0,o.deleteProfilePicture)(e.profilePicture)}catch(e){t.status(404).json({Error:"Can not delete Profile picture - no such file or directory"})}t.status(204).send(r)}else if(e.userId===i){const e=await l.getUser(i),r=await l.deleteUser(i,!0);try{e.profilePicture&&(0,o.deleteProfilePicture)(e.profilePicture)}catch(e){t.status(404).json({Error:"Can not delete Profile picture - no such file or directory"})}t.status(204).send(r)}else t.send(403),r(new Error("Invalid authorization, can not delete user."))}catch(e){t.send(404),r(new Error("Probably invalid userid, can not delete user."))}})),t.default=u},
/***/562:
/***/function(e,t,r){var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=i(r(860)),a=r(105),n=r(468),o=s.default.Router(),d=new a.UserService;
/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: "Get Users"
 *     deprecated: false
 *     description: "Retrieve all users"
 *     tags:
 *       - "User"
 *     responses:
 *       "200":
 *         description: "OK"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties: {}
 *       "403":
 *         description: "Forbidden - Invalid authorization"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "Invalid authorization."
 *       "404":
 *         description: "Not Found - Users not found"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "Users not found."
 *     security:
 *       - bearerAuth: []
 */
o.get("/users",n.requiresAuthentication,(async(e,t,r)=>{if("a"!==e.role)t.status(403),r(new Error("Invalid authorization"));else try{const e=await d.getUsers();t.status(200).send(e)}catch(e){t.status(404),r(e)}})),t.default=o},
/***/468:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.optionalAuthentication=t.requiresAuthentication=void 0;const i=r(829);
/**
 * Prüft Authentifizierung und schreibt `userId` mit Mongo-ID des Users und `role` mit Kürzel der Rolle in den Request.
 * Falls Authentifizierung fehlschlägt, wird ein Fehler (401) erzeugt.
 */t.requiresAuthentication=async function(e,t,r){try{const s=e.headers.authorization;if(s&&s.startsWith("Bearer ")){const a=s.substring(7),{userId:n,role:o}=(0,i.verifyJWT)(a);if(!n||!o)return t.status(401),r(new Error("Authentication Failed"));e.userId=n,e.role=o,r()}else t.status(401),t.setHeader("WWW-Authenticate",["Bearer",'realm="app"']),r(new Error("authentication required!"))}catch(e){t.status(401),t.setHeader("WWW-Authenticate",["Bearer",'realm="app"','error="invalid_token"']),r(e)}},t.optionalAuthentication=
/**
 * Prüft Authentifizierung und schreibt `userId` mit Mongo-ID des Users und `role` mit Kürzel der Rolle in den Request.
 * Falls kein JSON-Web-Token im Request-Header vorhanden ist, wird kein Fehler erzeugt (und auch nichts in den Request geschrieben).
 * Falls Authentifizierung fehlschlägt, wird ein Fehler (401) erzeugt.
 */
async function(e,t,r){const s=e.headers.authorization;if(s)try{const a=s.split(" ")[1],{userId:n,role:o}=(0,i.verifyJWT)(a);if(!n||!o)return t.status(401),r(new Error("Authentication Failed"));e.userId=n,e.role=o,r()}catch(e){t.status(401),r(e)}else r()}}
/***/,
/***/11:
/***/function(e,t,r){var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=i(r(860)),a=r(553),n=r(829),o=s.default.Router();
/**
 * @swagger
 * /api/login/:
 *  "post":
 *    "summary": "Login user"
 *    "description": "Endpoint to log in a user"
 *    "tags": [
 *      "User"
 *    ]
 *    "parameters": []
 *    "requestBody":
 *      "content":
 *        "application/json":
 *          "schema":
 *            "type": "object"
 *            "properties":
 *              "email":
 *                "type": "string"
 *              "password":
 *                "type": "string"
 *            "required":
 *              - "email"
 *              - "password"
 *          "example":
 *            "email": "John@doe.com"
 *            "password": "12abcAB!"
 *    "responses":
 *      "200":
 *        "description": "OK"
 *        "content":
 *          "application/json":
 *            "schema":
 *              "type": "object"
 *              "properties": {}
 *      "400":
 *        "description": "Bad Request - Validation Error"
 *        "content":
 *          "application/json":
 *            "schema":
 *              "type": "object"
 *              "properties":
 *                "error":
 *                  "type": "string"
 *                  "example": "Validation failed: Please provide a valid email and password."
 *      "401":
 *        "description": "Unauthorized - Missing JWT"
 *        "content":
 *          "application/json":
 *            "schema":
 *              "type": "object"
 *              "properties":
 *                "error":
 *                  "type": "string"
 *                  "example": "Unauthorized: No JWT token provided."
 *    "security":
 *      - "bearerAuth": []
 */
/**
 * Diese Funktion bitte noch nicht implementieren, sie steht hier als Platzhalter.
 * Wir benötigen dafür Authentifizierungsinformationen, die wir später in einem JSW speichern.
 */
o.post("/",(0,a.body)("email").isEmail(),(0,a.body)("password").isStrongPassword(),(async(e,t,r)=>{const i=(0,a.validationResult)(e);if(!i.isEmpty())return t.status(400).json({errors:i.array()});
//const loginResource = matchedData(req) as LoginResource;
const s=(0,a.matchedData)(e),o=await(0,n.verifyPasswordAndCreateJWT)(s.email,s.password);o||(t.status(401),r(new Error("no jwtstring")));const d={access_token:o,token_type:"Bearer"};t.send(d)})),t.default=o},
/***/682:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EventService=void 0;const i=r(185),s=r(924),a=r(95);class n{
/**
     * Event erstellen
     */
async createEvent(e,t){try{const r=await a.User.findById(t),n=await s.Event.create({name:e.name,creator:r.id,description:e.description,price:e.price,date:e.date,address:e.address,thumbnail:e.thumbnail,hashtags:e.hashtags,category:e.category,chat:new i.Types.ObjectId,participants:[t]});return{id:n.id,name:n.name,creator:n.creator.toString(),description:n.description,price:n.price,date:n.date,address:n.address,thumbnail:n.thumbnail,hashtags:n.hashtags,category:n.category,chat:n.chat.toString(),participants:n.participants.map((e=>e.toString()))}}catch(e){throw new Error("Event creation failed")}}
/**
     * Ein bestimmtes Event abrufen
     */async getEvent(e){try{const t=await s.Event.findById(e).exec();if(!t)throw new Error("Event not found");return{id:t.id,name:t.name,creator:t.creator.toString(),description:t.description,price:t.price,date:t.date,address:t.address,thumbnail:t.thumbnail,hashtags:t.hashtags,category:t.category,chat:t.chat.toString(),participants:t.participants.map((e=>e.toString()))}}catch(e){throw new Error("Error getting event")}}
/**
     * Alle erstellten Events abrufen ( Event Manager / Admin )
     */async getEvents(e){if(!e)throw new Error("Can not get creator, userID is invalid");try{const t=await s.Event.find({creator:e}).exec();return{events:t.map((e=>({id:e.id,name:e.name,creator:e.creator.toString(),description:e.description,price:e.price,date:e.date,address:e.address,thumbnail:e.thumbnail,hashtags:e.hashtags,category:e.category,chat:e.chat.toString(),participants:e.participants.map((e=>e.toString()))})))}}catch(e){throw new Error("Error getting events")}}
/**
     * Alle Events abrufen
     */async getAllEvents(){try{const e=await s.Event.find({}).exec();return{events:e.map((e=>({id:e.id,name:e.name,creator:e.creator.toString(),description:e.description,price:e.price,date:e.date,address:e.address,thumbnail:e.thumbnail,hashtags:e.hashtags,category:e.category,chat:e.chat.toString(),participants:e.participants.map((e=>e.toString()))})))}}catch(e){throw new Error("Error getting events")}}
/**
     * Events filtern / Event suchen
     */async searchEvents(e){if(!e||0===e.trim().length)return this.getAllEvents();try{const t=await s.Event.find({$or:[{name:{$regex:new RegExp(e,"i")}},{description:{$regex:new RegExp(e,"i")}},{hashtags:{$in:[new RegExp(e,"i")]}}]}).exec();return{events:t.map((e=>({id:e.id,name:e.name,creator:e.creator.toString(),description:e.description,price:e.price,date:e.date,address:e.address,thumbnail:e.thumbnail,hashtags:e.hashtags,category:e.category,chat:e.chat.toString(),participants:e.participants.map((e=>e.toString()))})))}}catch(e){throw new Error("Error searching events")}}
/**
     * Am Event teilnehmen ( Event Teilnehmer )
     */async joinEvent(e,t){if(!e)throw new Error(`User ID: ${e} is invalid.`);if(!t)throw new Error(`Event ID: ${t} is invalid.`);const r=await a.User.findById(e).exec(),i=await s.Event.findById(t).exec();if(!r)throw new Error("User not found");if(!i)throw new Error("Event not found");if(i.participants.includes(r._id))throw new Error("User is already participating in the event");try{return i.participants.push(r._id),await i.save(),!0}catch(e){return!1}}
/**
     * Alle teilgenommenen Events abrufen ( Event Teilnehmer )
     */async getJoinedEvents(e){try{const t=await s.Event.find({participants:e}).exec();return{events:t.map((e=>({id:e.id,name:e.name,creator:e.creator.toString(),description:e.description,price:e.price,date:e.date,address:e.address,thumbnail:e.thumbnail,hashtags:e.hashtags,category:e.category,chat:e.chat.toString(),participants:e.participants.map((e=>e.toString()))})))}}catch(e){throw new Error("Error getting events")}}
/**
     * Teilnahme am Event absagen ( Event Teilnehmer )
     */async cancelEvent(e,t){if(!e)throw new Error(`User ID: ${e} is invalid.`);if(!t)throw new Error(`Event ID: ${t} is invalid.`);const r=await s.Event.findById(t).exec();if(!r)throw new Error("Event not found");if(r.creator&&r.creator.toString()===e)throw new Error("Can not cancel participation as event manager");const a=r.participants.findIndex((t=>t.equals(new i.Types.ObjectId(e))));if(-1===a)throw new Error("User is not participating in the event");try{return r.participants.splice(a,1),await r.save(),!0}catch(e){return!1}}
/**
     * Alle Teilnehmer vom Event abrufen ( Event Manager / Admin )
     */async getParticipants(e,t){try{const r=await s.Event.findById(e).exec();if(!r)throw new Error("Event not found");const i=await a.User.findById(r.creator).exec(),n=await a.User.findById(t);if(!i||!n||i.id!==t&&!n.isAdministrator)throw new Error("Invalid authorization");const o=r.participants,d={users:(await a.User.find({_id:{$in:o}}).exec()).map((e=>({id:e.id,name:e.name,email:e.email,isAdministrator:e.isAdministrator,address:e.address,profilePicture:e.profilePicture,birthDate:e.birthDate,gender:e.gender,socialMediaUrls:e.socialMediaUrls,isActive:e.isActive})))};return d}catch(e){throw new Error("Error getting participants")}}
/**
     * Event bearbeiten ( Event Manager / Admin )
     */async updateEvent(e,t,r){const i=await s.Event.findById(e).exec();if(!i)throw new Error("Event not found");const n=await a.User.findById(i.creator).exec(),o=await a.User.findById(r).exec();if(!n||!o||n._id.toString()!==r&&!o.isAdministrator)throw new Error("Invalid authorization");if(t.name&&(i.name=t.name),t.description&&(i.description=t.description),void 0!==t.price){if(t.price<0)throw new Error("Event price cannot be less than 0");0===t.price?i.price=0:i.price=t.price}t.date&&(i.date=t.date),t.address&&(i.address=t.address),t.thumbnail&&(i.thumbnail=t.thumbnail),t.hashtags&&(i.hashtags=t.hashtags),t.category&&(i.category=t.category);const d=await i.save();return{id:d.id,name:d.name,creator:d.creator.toString(),description:d.description,price:d.price,date:d.date,address:d.address,thumbnail:d.thumbnail,hashtags:d.hashtags,category:d.category,chat:d.chat.toString(),participants:d.participants.map((e=>e.toString()))}}
/**
     * Event löschen ( Event Manager / Admin )
     */async deleteEvent(e,t){try{const r=await s.Event.findById(e).exec();if(!r)throw new Error("Event not found");const i=await a.User.findById(r.creator).exec(),n=await a.User.findById(t).exec();if(!i||!n||i._id.toString()!==t&&!n.isAdministrator)throw new Error("Invalid authorization");return 1==(await s.Event.deleteOne({_id:e}).exec()).deletedCount}catch(e){throw new Error("Error deleting event")}}}t.EventService=n,t.default=new n}
/***/,
/***/829:
/***/function(e,t,r){var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.verifyJWT=t.verifyPasswordAndCreateJWT=void 0;const s=r(344),a=r(95);i(r(142)).default.config(),t.verifyPasswordAndCreateJWT=
/**
 * @param email E-Mail-Adresse des Users
 * @param password Das Passwort des Users
 * @returns JWT als String, im JWT ist sub gesetzt mit der Mongo-ID des Users als String sowie role mit "u" oder "a" (User oder Admin);
 *      oder undefined wenn Authentifizierung fehlschlägt.
 */
async function(e,t){const r=await a.User.find({email:e,isActive:!0}).exec();if(!r||1!=r.length)return;const i=r[0];if(!await i.isCorrectPassword(t))return;const n=process.env.JWT_SECRET;if(!n)throw new Error("JWT_SECRET not set");const o=Math.floor(Date.now()/1e3),d=process.env.JWT_TTL;if(!d)throw new Error("TTL not set");const c=o+parseInt(d),u=i.isAdministrator?"a":"u",l={sub:i.id,iat:o,exp:c,role:u};return(0,s.sign)(l,n,{algorithm:"HS256"})},t.verifyJWT=
/**
 * Gibt user id (Mongo-ID) und ein Kürzel der Rolle zurück, falls Verifizierung erfolgreich, sonst wird ein Error geworfen.
 *
 * Die zur Prüfung der Signatur notwendige Passphrase wird aus der Umgebungsvariable `JWT_SECRET` gelesen,
 * falls diese nicht gesetzt ist, wird ein Fehler geworfen.
 *
 * @param jwtString das JWT
 * @return user id des Users (Mongo ID als String) und Rolle (u oder a) des Benutzers;
 *      niemals undefined (bei Fehler wird ein Error geworfen)
 */
function(e){var t;if(!e)throw new Error("No JWT-string");const r=process.env.JWT_SECRET;if(!r)throw new Error("JWT_SECRET not set");try{const i=(0,s.verify)(e,r);if("object"==typeof i&&"sub"in i&&i.sub){return{userId:null===(t=i.sub)||void 0===t?void 0:t.toString(),role:i.role}}}catch(e){throw new Error("verify_error")}throw new Error("invalid_token")}},
/***/105:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UserService=void 0;const i=r(95);class s{async registerUser(e){if(!e||"object"!=typeof e)throw new Error("Invalid user data");
// Check if the user already exists in the database
const{email:t}=e;if(await i.User.findOne({email:t}))throw new Error("User already exists");
// Create a new user
try{return await i.User.create(e)}catch(e){throw new Error("Registration failed")}}async getUsers(){return{users:(await i.User.find({}).exec()).map((e=>({id:e.id,name:e.name,email:e.email,isAdministrator:e.isAdministrator,address:e.address,profilePicture:e.profilePicture,birthDate:e.birthDate,gender:e.gender,socialMediaUrls:e.socialMediaUrls,isActive:e.isActive})))}}async getUser(e){if(!e)throw new Error("Can not get user, userID is invalid");const t=await i.User.findOne({_id:e,isActive:!0}).exec();if(!t)throw new Error(`No user with id: ${e} exists.`);return{id:t.id,name:t.name,email:t.email,isAdministrator:t.isAdministrator,address:t.address,profilePicture:t.profilePicture,birthDate:t.birthDate,gender:t.gender,socialMediaUrls:t.socialMediaUrls,isActive:t.isActive}}
/**
     * used to prefill db with standard admin user. Therefore this servicemethod does not need an endpoint.
     * @param userResource
     * @returns userResource
     */async createUser(e){const t=await i.User.create({name:e.name,email:e.email,isAdministrator:e.isAdministrator,address:e.address,password:e.password,profilePicture:e.profilePicture,birthDate:e.birthDate,gender:e.gender,socialMediaUrls:e.socialMediaUrls});return{id:t.id,name:t.name,email:t.email,isAdministrator:t.isAdministrator,address:t.address,profilePicture:t.profilePicture,birthDate:t.birthDate,gender:t.gender,socialMediaUrls:t.socialMediaUrls,isActive:t.isActive}}
/**
     * Admin function to update userdata. can update password & isAdministrator.
     * @param userResource
     * @returns userResource of updated user.
     */async updateUserWithAdmin(e){if(!e.id)throw new Error("User id is missing, cannot update User.");const t=await i.User.findById(e.id).exec();if(!t)throw new Error(`No user with id: ${e.id} found, cannot update`);if(e.name&&(t.name=e.name),e.email){if(e.email=e.email,e.email!==t.email){if(await i.User.count({email:e.email}).exec()>0)throw new Error("Duplicate email")}t.email=e.email}e.password&&(t.password=e.password),e.isAdministrator&&(t.isAdministrator=e.isAdministrator),e.address&&(t.address=e.address),e.birthDate&&(t.birthDate=e.birthDate),e.gender&&(t.gender=e.gender),e.profilePicture&&(t.profilePicture=e.profilePicture),e.socialMediaUrls&&(t.socialMediaUrls=e.socialMediaUrls),e.isActive&&(t.isActive=e.isActive);const r=await t.save();return{id:r.id,name:r.name,email:r.email,address:r.address,isAdministrator:r.isAdministrator,birthDate:r.birthDate,gender:r.gender,socialMediaUrls:r.socialMediaUrls,isActive:r.isActive,profilePicture:r.profilePicture}}
/**
     * only admins can change isAdministrator:
     * authorization to change isAdministrator is done in userRouter ->
     * isAdministratorfield = null if user in req is not an admin
     * @param userResource
     * @param oldPw
     * @returns userResource
     */async updateUserWithPw(e,t){var r,s;if(!e.id)throw new Error("User id is missing, cannot update User.");const a=await i.User.findById(e.id).exec();if(!a)throw new Error(`No user with id: ${e.id} found, cannot update`);if(t){if(!await a.isCorrectPassword(t))throw new Error("invalid oldPassword, can not update User!");e.password&&(a.password=e.password)}if((null===(r=e.name)||void 0===r?void 0:r.first)&&(a.name.first=e.name.first),(null===(s=e.name)||void 0===s?void 0:s.last)&&(a.name.last=e.name.last),e.email){if(e.email=e.email,e.email!==a.email){if(await i.User.count({email:e.email}).exec()>0)throw new Error("Duplicate email")}a.email=e.email}e.address&&(a.address=e.address),e.birthDate&&(a.birthDate=e.birthDate),e.gender&&(a.gender=e.gender),e.profilePicture&&(a.profilePicture=e.profilePicture),e.socialMediaUrls&&(a.socialMediaUrls=e.socialMediaUrls);const n=await a.save();return{id:n.id,name:n.name,email:n.email,address:n.address,isAdministrator:n.isAdministrator,birthDate:n.birthDate,gender:n.gender,socialMediaUrls:n.socialMediaUrls,isActive:a.isActive,profilePicture:n.profilePicture}}
/**
     * This function is used to either disable a user account or to delete the account from the database.
     * If the logged-in user is an admin (role in req.role === "a") and performs the "delete" endpoint request,
     * inactivateAccount is set to false, and the user is deleted from the database.
     * Otherwise, the user himself deactivates his account, and inactivateAccount is set to true.
     * @param userID The ID of the user to be deactivated or deleted.
     * @param inactivateAccount If true, user.isActive is set to false and the user object remains in the database; otherwise, the admin deletes the user from the database.
     * @returns true if the user was deleted or inactivated, false if no user was deleted.
     */async deleteUser(e,t){if(!e)throw new Error("invalid userID, can not delete/inactivate account");const r=await i.User.findOne({_id:e}).exec();if(!r)throw new Error("User not found, probably invalid userID or user is already deleted");if(t){r.isActive=!1;return!(await r.save()).isActive}return 1==(await i.User.deleteOne({_id:e})).deletedCount}}t.UserService=s,t.default=new s}
/***/,
/***/993:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});const i=r(95);t.default=async()=>{let e={email:"admin.team@connectandexplore.com",name:{first:"admin",last:"team"},password:"k.9MSn#JJh+§3F3a",isAdministrator:!0,address:{street:"Street",houseNumber:"1",postalCode:"12345",city:"Berlin",country:"Germany"},birthDate:new Date,gender:"male",isActive:!0,socialMediaUrls:{facebook:"facebook.com",instagram:"instagram.com"}};try{await i.User.create(e)}catch(e){console.error("Error creating admin user:",e)}}}
/***/,
/***/0:
/***/function(e,t,r){var i=this&&this.__createBinding||(Object.create?function(e,t,r,i){void 0===i&&(i=r);var s=Object.getOwnPropertyDescriptor(t,r);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,i,s)}:function(e,t,r,i){void 0===i&&(i=r),e[i]=t[r]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&i(t,e,r);return s(t,e),t},n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.upload=t.deleteEventThumbnail=t.deleteProfilePicture=void 0;const o=n(r(738)),d=n(r(17)),c=n(r(231)),u=r(828);a(r(142)).config();process.env.UPLOAD_PATH;
//Copyright of script: https://medium.com/@bviveksingh96/uploading-images-files-with-multer-in-node-js-f942e9319600
const l=o.default.diskStorage({destination:function(e,t,r){const i=
// This function is created with chatgpt
function(e){
//const uploadPath = process.env.UPLOAD_PATH || "uploads"; // Get upload path from .env file or use default 'uploads'
const t="uploads",r=d.default.join(__dirname,"../../Backend");// Assuming 'FileUpload.ts' is in the 'utils' directory
return"profilePicture"===e?d.default.join(r,t,"users"):"thumbnail"===e?d.default.join(r,t,"events"):d.default.join(r,t)}(t.fieldname);
// Check if the folder exists, create it if it doesn't
c.default.existsSync(i)||c.default.mkdirSync(i,{recursive:!0}),r(null,i)},filename:function(e,t,r){r(null,`${(0,u.v4)()}-${t.originalname}`)}});t.deleteProfilePicture=function(e){try{const t=d.default.join(__dirname,"../../Backend",e);// Assuming 'FileUpload.ts' is in the 'utils' directory
c.default.unlinkSync(t)}catch(e){throw e}},t.deleteEventThumbnail=function(e){
/**
    try {
      const fullPath = path.join(__dirname, "../../Backend", filePath); // Assuming 'FileUpload.ts' is in the 'utils' directory
      fs.unlinkSync(fullPath);
    } catch (error) {
      throw error;
    }
    */},
// file size : 10 MB limit
t.upload=(0,o.default)({storage:l,fileFilter:(e,t,r)=>{"image/jpg"===t.mimetype||"image/jpeg"===t.mimetype||"image/png"===t.mimetype?r(null,!0):r(new Error("Image uploaded is not of type jpg/jpeg or png"),!1)},limits:{fileSize:10485760}})},
/***/448:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.validate=void 0;const i=r(553),s=(e,t)=>(r,i,s)=>
// Check if the field exists in the request body and has a value
// && req.body[field] !== ""
void 0!==r.body[e]?t(r,i,s):s();
// Validation middleware
t.validate=[s("email",(0,i.body)("email").isEmail()),s("name.first",(0,i.body)("name.first").isString()),s("name.last",(0,i.body)("name.last").isString()),s("password",(0,i.body)("password").isStrongPassword()),s("isAdministrator",(0,i.body)("isAdministrator").isBoolean()),
//validateIfPresent("oldPassword", body("oldPassword").isStrongPassword()),
s("address.street",(0,i.body)("address.street").isString()),s("address.houseNumber",(0,i.body)("address.houseNumber").isNumeric().withMessage("houseNumber is required.")),s("address.postalCode",(0,i.body)("address.postalCode").isNumeric().withMessage("Postal code is required.")),s("address.city",(0,i.body)("address.city").isString().withMessage("City is required.")),s("address.country",(0,i.body)("address.country").isString().withMessage("Country is required.")),s("address.stateOrRegion",(0,i.body)("address.stateOrRegion").isString().withMessage("invalid State or Region.")),s("address.appartmentNumber",(0,i.body)("address.appartmentNumber").isString().withMessage("invalid Appartmentnumber.")),s("profilePicture",(0,i.body)("profilePicture").isString()),s("birthDate",(0,i.body)("birthDate").isString()),s("gender",(0,i.body)("gender").isString()),s("socialMediaUrls.facebook",(0,i.body)("socialMediaUrls.facebook").isString()),s('socialMediaUrls.instagram"',(0,i.body)("socialMediaUrls.instagram").isString())]}
/***/,
/***/811:
/***/function(e,t,r){
// Copyrights Code: https://github.com/TomDoesTech/REST-API-Tutorial-Updated/blob/main/src/utils/swagger.ts
var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=i(r(777)),a=i(r(948)),n={definition:{openapi:"3.1.0",info:{title:"Explore and Connect REST API Docs",version:r(147).version},components:{securitySchemes:{bearerAuth:{type:"http",scheme:"bearer",bearerFormat:"JWT"}},schemas:{IAddress:{type:"object",properties:{street:{type:"string"},houseNumber:{type:"string"},apartmentNumber:{type:"string"},postalCode:{type:"string"},city:{type:"string"},stateOrRegion:{type:"string"},country:{type:"string"}}},ICategory:{type:"object",properties:{name:{type:"string"},description:{type:"string"}}},IChat:{type:"object",properties:{}},IUser:{type:"object",properties:{email:{type:"string"},name:{type:"object",properties:{first:{type:"string"},last:{type:"string"}}},password:{type:"string"},isAdministrator:{type:"boolean"},address:{$ref:"#/components/schemas/IAddress"},profilePicture:{type:"string"},birthDate:{type:"date",format:"date"},gender:{type:"string"},socialMediaUrls:{type:"object",properties:{facebook:{type:"string"},instagram:{type:"string"}}},isActive:{type:"boolean"}}},IEvent:{type:"object",properties:{name:{type:"string"},creator:{$ref:"#/components/schemas/IUser"},description:{type:"string"},price:{type:"number",minimum:0},date:{type:"string",// Date represented as string in ISO 8601 format
format:"date-time"},address:{$ref:"#/components/schemas/IAddress"},thumbnail:{type:"string"},hashtags:{type:"array",items:{type:"string"}},category:{type:"array",items:{$ref:"#/components/schemas/ICategory"}},chat:{$ref:"#/components/schemas/IChat"},participants:{type:"array",items:{type:"string"}}}}}},security:[{bearerAuth:[]}]},apis:["./src/routes/*.ts","./src/model/*.ts"]},o=(0,s.default)(n);t.default=function(e,t){
// Swagger page
e.use("/swagger/docs",a.default.serve,a.default.setup(o)),
// Docs in JSON format
e.get("/docs.json",((e,t)=>{t.setHeader("Content-Type","application/json"),t.send(o)})),console.log(`Docs available at https://localhost:${t}/swagger/docs`)}},
/***/432:
/***/e=>{e.exports=require("bcryptjs");
/***/},
/***/986:
/***/e=>{e.exports=require("body-parser");
/***/},
/***/582:
/***/e=>{e.exports=require("cors");
/***/},
/***/142:
/***/e=>{e.exports=require("dotenv");
/***/},
/***/860:
/***/e=>{e.exports=require("express");
/***/},
/***/553:
/***/e=>{e.exports=require("express-validator");
/***/},
/***/231:
/***/e=>{e.exports=require("fs");
/***/},
/***/617:
/***/e=>{e.exports=require("https");
/***/},
/***/344:
/***/e=>{e.exports=require("jsonwebtoken");
/***/},
/***/725:
/***/e=>{e.exports=require("mongodb-memory-server");
/***/},
/***/185:
/***/e=>{e.exports=require("mongoose");
/***/},
/***/738:
/***/e=>{e.exports=require("multer");
/***/},
/***/777:
/***/e=>{e.exports=require("swagger-jsdoc");
/***/},
/***/948:
/***/e=>{e.exports=require("swagger-ui-express");
/***/},
/***/828:
/***/e=>{e.exports=require("uuid");
/***/},
/***/685:
/***/e=>{e.exports=require("http");
/***/},
/***/17:
/***/e=>{e.exports=require("path");
/***/},
/***/147:
/***/e=>{e.exports=JSON.parse('{"name":"backend","version":"1.0.0","description":"Backend for Connect & Explore","main":"server.js","scripts":{"test":"set PORT=0 && jest --config jest.config.js --forceExit --maxworkers=2 ","format":"prettier --write src tests","start":"npm run build && nodemon ./dist/bundle.js ","build":"webpack --mode production"},"repository":{"type":"git","url":"https://gitlab.bht-berlin.de/s85975/connectandexplore.git"},"keywords":["Express.js","MongoDB","NodeJS"],"author":"Mariam Daliri, Naceur Sayedi, Georg Sittnick, Khatia Zitanishvili , Minh Trinh, Christian Dahlenburg","license":"ISC","devDependencies":{"@types/bcryptjs":"^2.4.5","@types/express":"^4.17.21","@types/jest":"^29.5.8","@types/supertest":"^2.0.16","clean-webpack-plugin":"^4.0.0","copy-webpack-plugin":"^11.0.0","dotenv":"^16.3.1","glob":"^10.3.10","jest":"^29.7.0","jest-junit":"^16.0.0","mongodb-memory-server":"^9.0.1","nodemon":"^3.0.1","optimize-css-assets-webpack-plugin":"^6.0.1","supertest":"^6.3.3","terser-webpack-plugin":"^5.3.9","ts-jest":"^29.1.1","ts-loader":"^9.5.1","typescript":"^5.3.2","webpack":"^5.89.0","webpack-cli":"^5.1.4","webpack-node-externals":"^3.0.0"},"dependencies":{"@types/dotenv":"^8.2.0","@types/jsonwebtoken":"^9.0.5","@types/multer":"^1.4.9","@types/swagger-jsdoc":"^6.0.2","@types/swagger-ui-express":"^4.1.5","@types/uuid":"^9.0.7","bcryptjs":"^2.4.3","body-parser":"^1.20.2","cors":"^2.8.5","express":"^4.18.2","express-validator":"^7.0.1","fs":"^0.0.1-security","https":"^1.0.0","jsonwebtoken":"^9.0.2","mongoose":"^7.6.5","multer":"^1.4.5-lts.1","prettier":"^3.0.3","swagger-jsdoc":"^6.2.8","swagger-ui-express":"^5.0.0","ts-node":"^10.9.1"}}');
/***/
/******/}},t={};
/************************************************************************/
/******/ // The module cache
/******/
/******/
/************************************************************************/
/******/
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module is referenced by other modules so it can't be inlined
/******/(
/******/
/******/ // The require function
/******/function r(i){
/******/ // Check if module is in cache
/******/var s=t[i];
/******/if(void 0!==s)
/******/return s.exports;
/******/
/******/ // Create a new module (and put it into the cache)
/******/var a=t[i]={
/******/ // no module.id needed
/******/ // no module.loaded needed
/******/exports:{}
/******/};
/******/
/******/ // Execute the module function
/******/
/******/
/******/ // Return the exports of the module
/******/return e[i].call(a.exports,a,a.exports,r),a.exports;
/******/})(505);
/******/
/******/})();