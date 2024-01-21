/******/(()=>{// webpackBootstrap
/******/"use strict";
/******/var e={
/***/14:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.clearDatabase=t.closeDatabase=t.connect=void 0;
// Copyright: This script is taken from: https://codesandbox.io/s/typescript-forked-8vscow?file=/src/db.ts
const n=a(r(185)),i=r(725);let s;t.connect=async()=>{s=await i.MongoMemoryServer.create();const e=s.getUri();await n.default.connect(e,{dbName:"ConnectAndExplore"}).then((e=>console.log("connected...."))).catch((e=>console.log(`Cannot connect => ${e}`)))};t.closeDatabase=async()=>{await n.default.connection.dropDatabase(),await n.default.connection.close(),await s.stop()};t.clearDatabase=async()=>{const e=n.default.connection.collections;for(const t in e){const r=e[t];await r.deleteMany({})}}},
/***/505:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.server=void 0;const n=a(r(860)),i=r(986),s=r(231),o=r(582),d=s.readFileSync("./certificates/key.pem"),c=s.readFileSync("./certificates/cert.pem"),u=r(14),l=a(r(993)),m=a(r(617)),p=(r(685),a(r(811))),g=a(r(79)),y=a(r(562)),h=a(r(11)),f=a(r(996)),w=a(r(653)),v=a(r(109)),b=a(r(952)),E=a(r(62)),S=(0,n.default)(),I=process.env.PORT||443;
/* Routes */
S.use("*",o()),S.use((function(e,t,r){t.header("Access-Control-Allow-Origin","*"),t.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept"),t.header("Access-Control-Expose-Headers","Authorization"),r()})),t.server=m.default.createServer({key:d,cert:c},S);r(69)(t.server,{cors:{origin:"http://localhost:3000",methods:["GET","POST"]}}).on("connection",(e=>{
//console.log("socket connected");
e.on("disconnect",(()=>{})),e.on("join_room",(({roomId:t})=>{e.join(t)})),e.on("send_message",(({user:t,message:r,roomId:a,time:n})=>{
//console.log(`(${roomId})> (${time}) ${user}: ${message}`);
e.to(a).emit("receive_message",{user:t,message:r,time:n})}))})),S.use(i.json()),S.use(n.default.urlencoded({extended:!0})),S.use(n.default.static(__dirname)),S.use("/api/users",g.default),S.use("/api",y.default),S.use("/api/login",h.default),S.use("/api/events",f.default),S.use("/api/comments",v.default),S.use("/api/chat",b.default),S.use("/images/users",n.default.static("uploads/users")),S.use("/images/events",n.default.static("uploads/events")),S.use("/api/rating",E.default),(0,p.default)(S,+I),S.use(((e,t,r)=>{t.status(404).json("Not Found")})),(0,u.connect)().then((async()=>{
// Create admin user after connecting to the database
await(0,l.default)(),await(0,w.default)(),t.server.listen(I,(()=>{console.log("Listening on port ",I)}))})).catch((e=>{console.error("Failed to connect to the database:",e)})),t.default=S},
/***/439:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Comment=void 0;const a=r(185),n=new a.Schema({title:{type:String,required:!0},stars:{type:Number,required:!0,validate:{validator:e=>e>=1&&e<=5,message:"Stars must be between 0 and 5."}},content:{type:String,required:!0},edited:{type:Boolean,default:!1},creator:{type:a.Schema.Types.ObjectId,ref:"User",required:!0},event:{type:a.Schema.Types.ObjectId,ref:"Event",required:!0}},{timestamps:!0});t.Comment=(0,a.model)("Comment",n)}
/***/,
/***/924:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Chat=t.Categoty=t.Event=t.addressESchema=void 0;const a=r(185);
/**
 * Adressen werden später in das EventSchema eingefügt und als teil eines Users in mongoDB gespeichert
 */t.addressESchema=new a.Schema({street:{type:String,required:!0},houseNumber:{type:String,required:!0},apartmentNumber:String,postalCode:{type:String,required:!0},city:{type:String,required:!0},stateOrRegion:String,country:{type:String,required:!0}});const n=new a.Schema({name:{type:String,required:!0/* , unique: true */},description:{type:String}}),i=new a.Schema({event:{type:a.Schema.Types.ObjectId,ref:"Event"},messages:[{user:{type:a.Schema.Types.ObjectId,ref:"User"},message:String,time:Date}]}),s=new a.Schema({name:{type:String,required:!0},creator:{type:a.Schema.Types.ObjectId,ref:"User",required:!0},description:{type:String,required:!0},price:{type:Number,required:!0,min:0},date:{type:Date,required:!0},address:t.addressESchema,thumbnail:{type:String},hashtags:[{type:String}],category:[n],chat:{type:a.Schema.Types.ObjectId,ref:"Chat",required:!0},participants:[{type:a.Schema.Types.ObjectId,ref:"User",required:!0}]});
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
t.Event=(0,a.model)("Event",s),t.Categoty=(0,a.model)("Category",n),t.Chat=(0,a.model)("Chat",i)}
/***/,
/***/467:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Rating=t.RatingType=void 0;const a=r(185);var n;!function(e){e.Helpful="helpful",e.Reported="reported"}(n||(t.RatingType=n={}));const i=new a.Schema({comment:{type:a.Schema.Types.ObjectId,ref:"Comment",required:!0},creator:{type:a.Schema.Types.ObjectId,ref:"User",required:!0},ratingType:{type:String,enum:Object.values(n),required:!0}});t.Rating=(0,a.model)("Rating",i)}
/***/,
/***/95:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.User=t.addressSchema=t.userRole=void 0;const n=r(185),i=a(r(432));var s;!function(e){e.User="u",e.Admin="a"}(s||(t.userRole=s={})),
/**
 * Adressen werden später in das UserSchema eingefügt und als teil eines Users in mongoDB gespeichert
 */
t.addressSchema=new n.Schema({postalCode:{type:String,required:!0},city:{type:String,required:!0}});const o=new n.Schema({email:{type:String,required:!0,unique:!0},name:{first:{type:String,required:!0},last:{type:String,required:!0}},password:{type:String,required:!0},isAdministrator:{type:Boolean,default:!1},address:t.addressSchema,profilePicture:String,birthDate:{type:Date,required:!0},gender:{type:String,required:!0},socialMediaUrls:{facebook:String,instagram:String},isActive:{type:Boolean,default:!0}});o.pre("save",(async function(){if(this.isModified("password")){const e=await i.default.hash(this.password,10);this.password=e}})),o.pre("updateOne",{document:!1,query:!0},(async function(){const e=this.getUpdate();if(null!=(null==e?void 0:e.password)){const t=await i.default.hash(e.password,10);e.password=t}})),o.method("isCorrectPassword",(async function(e){return await i.default.compare(e,this.password)})),t.User=(0,n.model)("User",o)},
/***/952:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const n=a(r(860)),i=r(659),s=r(468),o=r(553),d=r(924),c=r(185),u=n.default.Router(),l=new i.ChatService;u.get("/:id",s.requiresAuthentication,(0,o.param)("id").isMongoId(),(async(e,t,r)=>{try{const r=await l.getChat(e.params.id);if(!(await d.Event.findById(r.event).exec()).participants.includes(new c.Types.ObjectId(e.userId)))return t.status(403).json("User is not participating in the event");t.status(200).send(r)}catch(e){t.status(500).json({error:"Internal Server Error"})}})),u.post("/:id",s.requiresAuthentication,(0,o.param)("id").isMongoId(),(0,o.body)("message").isString().notEmpty(),(async(e,t,r)=>{try{const r=await l.sendMessage(e.params.id,e.userId,e.body.message);t.status(200).send(r)}catch(e){if("User is not participating in the event"===e.message)return t.status(403).json({Error:e.message});t.status(500).json({error:"Internal Server Error"})}})),t.default=u},
/***/109:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const n=a(r(860)),i=r(468),s=r(553),o=r(282),d=r(980),c=r(439),u=n.default.Router(),l=new o.CommentService,m=new d.RatingService;u.get("/",i.requiresAuthentication,(async(e,t,r)=>{if("a"===e.role)try{const e=await l.getComments();t.status(200).send(e)}catch(e){t.status(404),r(e)}else t.status(403),r(new Error("Unauthorized for this resource!"))})),
/**
 * @swagger
 * /api/comments/event/{id}:
 *   get:
 *     summary: Get all comments of an event
 *     description: Retrieve all comments associated with a specific event.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to retrieve comments for
 *         schema:
 *           type: string
 *           format: mongo-id
 *     responses:
 *       '200':
 *         description: Successful response with comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IComment'
 *       '404':
 *         description: Event not found or no comments exist for the event
 *         content:
 *           application/json:
 *             example:
 *               error: Event not found or no comments exist for the event
 */
u.get("/event/:id",i.optionalAuthentication,(0,s.param)("id").isMongoId(),(async(e,t,r)=>{var a;const n=null===(a=e.params)||void 0===a?void 0:a.id;try{const e=await l.getCommentsOfEvent(n),r={comments:[]};for(const t of e.comments){const e=await m.getRatingsOfComment(t.id);if(t.creatorName){let a=Object.assign(Object.assign({},t),{ratings:e});r.comments.push(a)}}t.send(r)}catch(e){t.status(404),r(e)}})),u.get("/user/:id",i.requiresAuthentication,(0,s.param)("id").isMongoId(),(async(e,t,r)=>{try{const a=await l.getComments();a.comments.length<1&&t.send(a),"a"/* || req.userId !== comments.comments[0].id */===e.role?
//admin dashboard for comments of an user and user dashbaord of comments
t.status(200).send(a):(t.status(403),r(new Error("Unauthorized for this resource!")))}catch(e){t.status(404),r(e)}})),
/**
 * @swagger
 * /api/comments/post:
 *   post:
 *     summary: Create a new comment
 *     description: Endpoint to create a new comment.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Amazing"
 *                 description: "Title of the comment (max length: 100)"
 *               stars:
 *                 type: integer
 *                 example: 4
 *                 description: "Number of stars (1-5)"
 *               content:
 *                 type: string
 *                 example: "The best Event that i have joined in my entire life"
 *                 description: "Content of the comment (max length: 1000)"
 *               creator:
 *                 type: string
 *                 format: mongo-id
 *                 description: "ID of the comment creator (User ID)"
 *               edited:
 *                 type: boolean
 *                 default: false
 *                 description: "Indicates if the comment has been edited"
 *               event:
 *                 type: string
 *                 format: mongo-id
 *                 description: "ID of the associated event"
 *             required:
 *               - title
 *               - stars
 *               - content
 *               - creator
 *               - event
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IComment'
 *       '400':
 *         description: Bad request, validation error or other errors
 *         content:
 *           application/json:
 *             examples:
 *               BadRequestExample1:
 *                 summary: User has already submitted a comment for this event
 *                 value:
 *                   error: User has already submitted a comment for this event
 *               BadRequestExample2:
 *                 summary: No creator/event with the given ID exists
 *                 value:
 *                   error: No creator/event with the given ID exists
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               error: Only users are authorized to create comments!
 */
u.post("/post",i.requiresAuthentication,(0,s.body)("title").isString().isLength({min:1,max:100}),(0,s.body)("stars").isInt().custom((e=>e>=1&&e<=5)),(0,s.body)("content").isString().isLength({min:0,max:1e3}),(0,s.body)("creator").isMongoId(),(0,s.body)("edited").optional().isBoolean(),(0,s.body)("event").isMongoId(),(async(e,t,r)=>{const a=(0,s.validationResult)(e);if(!a.isEmpty())return t.status(400).json({errors:a.array()});if("u"===e.role&&e.body.creator!==e.userId)return t.status(403),r(new Error("Not authorized to post comment."));try{const r=(0,s.matchedData)(e),a=await l.createComment(r);t.status(201).send(a)}catch(e){t.status(400),r(e)}})),
/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment
 *     description: Update an existing comment by ID.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to update
 *         schema:
 *           type: string
 *           format: mongo-id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Amazing"
 *                 description: "Title of the comment (max length: 100)"
 *               stars:
 *                 type: integer
 *                 example: 4
 *                 description: "Number of stars (1-5)"
 *               content:
 *                 type: string
 *                 example: "The best Event that i have joined in my entire life"
 *                 description: "Content of the comment (max length: 1000)"
 *               creator:
 *                 type: string
 *                 format: mongo-id
 *                 description: "ID of the comment creator (User ID)"
 *               edited:
 *                 type: boolean
 *                 default: false
 *                 description: "Indicates if the comment has been edited"
 *               event:
 *                 type: string
 *                 format: mongo-id
 *                 description: "ID of the associated event"
 *     responses:
 *       '200':
 *         description: Successful update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IComment'
 *       '400':
 *         description: Bad request, validation error or other errors
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request, validation error or other errors
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               error: Only admins or the creator are authorized to update comments!
 *       '404':
 *         description: Comment not found or unauthorized to update
 *         content:
 *           application/json:
 *             example:
 *               error: Comment not found or unauthorized to update
 */
u.put("/:id",i.requiresAuthentication,(0,s.param)("id").isMongoId(),(0,s.body)("title").isString().isLength({min:1,max:100}),(0,s.body)("stars").isInt().custom((e=>e>=1&&e<=5)),(0,s.body)("content").isString().isLength({min:0,max:1e3}),(0,s.body)("creator").isMongoId(),(0,s.body)("edited").optional().isBoolean(),(0,s.body)("event").isMongoId(),(async(e,t,r)=>{const a=(0,s.validationResult)(e);if(!a.isEmpty())return t.status(400).json({errors:a.array()});"u"===e.role&&e.body.creator!==e.userId&&(t.status(403),r(new Error("Only admins or the creator are authorized to update comments!")));try{const r=(0,s.matchedData)(e);r.id===e.params.id&&(r.id=e.params.id);const a=await l.updateComment(r);t.status(200).send(a)}catch(e){t.status(400),r(e)}})),
/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete an existing comment by ID.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: string
 *           format: mongo-id
 *     responses:
 *       '204':
 *         description: Comment deleted successfully
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               error: Only Admins and the creator of the comment are authorized to delete comments!
 *       '404':
 *         description: Comment not found or unauthorized to delete
 *         content:
 *           application/json:
 *             example:
 *               error: Comment not found or unauthorized to delete
 */
u.delete("/:id",i.requiresAuthentication,(0,s.param)("id").isMongoId(),(async(e,t,r)=>{const a=e.params.id,n=await c.Comment.findById(a).exec();if("u"===e.role&&n.creator.toString()!==e.userId)return t.status(403),void r(new Error("Only Admins and the creator of the comment are authorized to delete comments!"));try{await m.deleteRatingsOfComment(a),await l.deleteComment(a),t.sendStatus(204)}catch(e){t.status(404),r(e)}})),
/**
 * @swagger
 * /api/comments/event/{id}/average-rating:
 *   get:
 *     summary: Calculate the average rating of an event based on comments
 *     description: Retrieves the average rating of an event by its ID using the comments associated with it.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to calculate the average rating for
 *         schema:
 *           type: string
 *           format: mongo-id
 *     responses:
 *       '200':
 *         description: Successful response with average rating
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageRating:
 *                   type: number
 *                   description: The calculated average rating of the event based on comments
 *                   example: 3.5
 *       '400':
 *         description: Bad request, invalid ID format
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request, invalid ID format
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
u.get("/event/:id/average-rating",(0,s.param)("id").isMongoId(),(async(e,t,r)=>{try{const r=e.params.id,a=await l.getAverageRatingForEvent(r);t.status(200).json({averageRating:a})}catch(e){t.status(500).json({error:"Internal Server Error"})}})),t.default=u},
/***/996:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const n=a(r(860)),i=r(682),s=r(468),o=r(553),d=r(0),c=n.default.Router(),u=new i.EventService;
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
c.get("/search",s.optionalAuthentication,[(0,o.query)("query").isString().notEmpty()],(async(e,t,r)=>{const a=(0,o.validationResult)(e);if(!a.isEmpty())return t.status(400).json({errors:a.array()});try{
//console.log(query)
const r=e.query.query,a=await u.searchEvents(r);if(0===a.events.length)return t.status(204).json({message:"No events found matching the query."});t.status(200).send(a)}catch(e){t.status(404),r(e)}})),
/**
 * @swagger
 * /api/events/create:
 *   post:
 *     summary: Create a new event.
 *     description: Endpoint to create a new event.
 *     tags:
 *       - "Event"
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the event.
 *                 example: Test Event
 *               price:
 *                 type: number
 *                 description: Price of the event.
 *                 example: 10
 *               description:
 *                 type: string
 *                 description: Description of the event.
 *                 example: This is a test event description.
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date of the event.
 *                 example: "2024-01-01T12:00:00Z"
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     description: Street address.
 *                     example: 123 Test Street
 *                   houseNumber:
 *                     type: string
 *                     description: House number.
 *                     example: 1A
 *                   postalCode:
 *                     type: string
 *                     description: Postal code.
 *                     example: "12345"
 *                   city:
 *                     type: string
 *                     description: City.
 *                     example: Test City
 *                   country:
 *                     type: string
 *                     description: Country.
 *                     example: Test Country
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Event thumbnail file (image).
 *               hashtags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of event hashtags (optional).
 *                 example: ["test", "event"]
 *               category:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Category name.
 *                       example: Test Category
 *                     description:
 *                       type: string
 *                       description: Category description.
 *                       example: This is a test category.
 *                 description: Array of event categories.
 *                 example: [{ "name": "Test Category", "description": "This is a test category." }]
 *     responses:
 *       '201':
 *         description: Event created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IEvent'
 *       '400':
 *         description: Bad request. Invalid input parameters.
 *       '401':
 *         description: Unauthorized. Missing or invalid authentication token.
 *       '500':
 *         description: Internal server error. Failed to create an event.
 */
c.post("/create",s.requiresAuthentication,d.upload.single("thumbnail"),[(0,o.body)("name").isString().notEmpty().withMessage("Event name is required."),
//body("creator").isString().notEmpty(),
// body("price").isNumeric().notEmpty(),
(0,o.body)("description").isString().notEmpty().withMessage("Description is required."),(0,o.body)("date")/* .isDate() */.notEmpty(),(0,o.body)("address.street").notEmpty().withMessage("Street address is required."),(0,o.body)("address.houseNumber").notEmpty().withMessage("House number is required."),(0,o.body)("address.postalCode").notEmpty().withMessage("Postal code is required."),(0,o.body)("address.city").notEmpty().withMessage("City is required."),(0,o.body)("address.country").notEmpty().withMessage("Country is required."),(0,o.body)("address.stateOrRegion").optional().isString().withMessage("Invalid State or Region."),(0,o.body)("address.apartmentNumber").optional().isString().withMessage("Invalid Apartment number.")],(async(e,t)=>{try{const r=(0,o.validationResult)(e);if(r.isEmpty()){e.file&&(console.log("req.file",e.file),e.body.thumbnail=`/${e.file.filename}`,console.log("Event bild uploaded")),e.body.category=JSON.parse(e.body.category),e.body.hashtags=JSON.parse(e.body.hashtags),e.body.price=Number(e.body.price),e.body.address=JSON.parse(e.body.address),console.log("Event data ",e.body);const r=await u.createEvent(e.body,e.userId);return console.log("Created Event:",r),t.status(201).send(r)}return e.file&&(
// Delete the file
console.log("errors:",r),(0,d.deleteEventThumbnail)(e.file.path)),t.status(400).json({errors:r.array()})}catch(e){return t.status(500).json({Error:"Event creation failed"})}})),
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
c.post("/:eventid/join",s.requiresAuthentication,(0,o.param)("eventid").isMongoId(),(async(e,t,r)=>{try{await u.joinEvent(e.userId,e.params.eventid),t.status(200).json({message:"User joined the event successfully"})}catch(e){return"User not found"===e.message||"Event not found"===e.message?t.status(404).json({Error:e.message}):"User is already participating in the event"===e.message?t.status(409).json({Error:e.message}):t.status(500).json({Error:"Joining event failed"})}})),
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
c.delete("/:eventid/cancel",s.requiresAuthentication,(0,o.param)("eventid").isMongoId(),(async(e,t,r)=>{try{await u.cancelEvent(e.userId,e.params.eventid),t.status(204).send()}catch(e){return"User is not participating in the event"===e.message||"Can not cancel participation as event manager"===e.message?t.status(409).json({Error:e.message}):t.status(500).json({Error:"Canceling event failed"})}})),
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
c.get("/joined",s.requiresAuthentication,(async(e,t,r)=>{try{const r=await u.getJoinedEvents(e.userId);if(0===r.events.length)return t.status(204).json({message:"No events found."});t.status(200).send(r)}catch(e){t.status(404),r(e)}})),
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
c.get("/:eventid/participants",s.requiresAuthentication,(0,o.param)("eventid").isMongoId(),(async(e,t,r)=>{try{const r=await u.getParticipants(e.params.eventid,e.userId);t.status(200).send(r)}catch(e){t.status(404),r(e)}})),
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
c.get("/:eventid",s.optionalAuthentication,(0,o.param)("eventid").isMongoId(),(async(e,t,r)=>{const a=(0,o.validationResult)(e);if(!a.isEmpty())return t.status(400).json({errors:a.array()});try{const r=await u.getEvent(e.params.eventid);t.status(200).send(r)}catch(e){t.status(404),r(e)}})),c.put("/:eventid",s.requiresAuthentication,d.upload.single("thumbnail"),(0,o.param)("eventid").isMongoId(),(async(e,t,r)=>{const a=(0,o.validationResult)(e);if(!a.isEmpty())return e.file&&(
// Delete the file
console.log("errors:",a),(0,d.deleteEventThumbnail)(e.file.path)),t.status(400).json({errors:a.array()});try{const r=await u.getEvent(e.params.eventid);e.file&&(e.body.thumbnail=`/${e.file.filename}`,r.thumbnail&&(0,d.deleteEventThumbnail)(r.thumbnail),console.log("Event bild uploaded")),e.body.category&&(e.body.category=JSON.parse(e.body.category)),e.body.hashtags&&(e.body.hashtags=JSON.parse(e.body.hashtags)),e.body.price&&(e.body.price=Number(e.body.price)),e.body.address&&(e.body.address=JSON.parse(e.body.address)),console.log("Event data ",e.body);const a=e.body,n=await u.updateEvent(e.params.eventid,a,e.userId);t.status(200).send(n)}catch(a){(0,d.deleteEventThumbnail)(e.body.thumbnail),t.status(404),r(a)}})),
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
c.delete("/:eventid",s.requiresAuthentication,(0,o.param)("eventid").isMongoId(),(async(e,t,r)=>{try{const r=await u.getEvent(e.params.eventid),a=await u.deleteEvent(e.params.eventid,e.userId);r.thumbnail&&(0,d.deleteEventThumbnail)(r.thumbnail),a?t.status(204).json({message:"Event successfully deleted"}):t.status(405).json({error:"Event could not be deleted"})}catch(e){t.status(404),r(e)}})),
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
c.get("/creator/:userid",s.requiresAuthentication,(0,o.param)("userid").isMongoId(),(async(e,t,r)=>{if("a"===e.role||e.params.userid===e.userId)try{const r=e.params.userid,a=await u.getEvents(r);if(0===a.events.length)return t.status(204).json({message:"No events found."});t.status(200).send(a)}catch(e){t.status(404),r(e)}else t.status(403),r(new Error("Invalid authorization"))})),
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
c.get("/",s.optionalAuthentication,(async(e,t,r)=>{try{const e=await u.getAllEvents();if(0===e.events.length)return t.status(204).json({message:"No events found."});t.status(200).send(e)}catch(e){t.status(404),r(e)}})),t.default=c},
/***/62:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const n=a(r(860)),i=r(468),s=r(553),o=r(467),d=r(980),c=n.default.Router(),u=new d.RatingService;c.post("/rating",i.requiresAuthentication,(0,s.body)("comment").isMongoId(),(0,s.body)("creator").isMongoId(),(0,s.body)("ratingType").isIn([o.RatingType.Helpful,o.RatingType.Reported]).withMessage("invalid ratingtype."),(async(e,t,r)=>{const a=(0,s.validationResult)(e);if(!a.isEmpty())return t.status(400).json({errors:a.array()});const n=(0,s.matchedData)(e);n.creator!==e.userId&&(t.status(403),r(new Error("unauthorized.")));try{const e=await u.createRating(n);t.status(201).send(e)}catch(e){t.status(400),r(e)}})),t.default=c},
/***/79:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const n=a(r(860)),i=r(553),s=r(105),o=r(0),d=r(468),c=n.default.Router(),u=new s.UserService;
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
 *                address[postalCode]:
 *                  type: string
 *                  example: "12345"
 *                address[city]:
 *                  type: string
 *                  example: "Berlin"
 *              required:
 *                - email
 *                - password
 *                - gender
 *                - birthDate
 *                - name[first]
 *                - name[last]
 *                - address[postalCode]
 *                - address[city]
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
c.post("/register",o.upload.single("profilePicture"),[(0,i.body)("email").isEmail(),(0,i.body)("name.first").isString().isLength({min:3,max:100}).withMessage("First name is required."),(0,i.body)("name.last").isString().isLength({min:3,max:100}).withMessage("Last name is required."),(0,i.body)("password").isStrongPassword(),(0,i.body)("isAdministrator").optional().isBoolean(),(0,i.body)("address.postalCode").notEmpty().withMessage("Postal code is required."),(0,i.body)("address.city").notEmpty().withMessage("City is required."),(0,i.body)("profilePicture").optional().isString(),(0,i.body)("birthDate").isDate(),(0,i.body)("gender").isString().notEmpty(),(0,i.body)("socialMediaUrls.facebook").optional().isString(),(0,i.body)("socialMediaUrls.instagram").optional().isString()],(async(e,t)=>{try{const r=(0,i.validationResult)(e);if(r.isEmpty()){e.file&&(e.body.profilePicture=`/${e.file.filename}`),console.log("Req body user registration:",e.body);const r=await u.registerUser(e.body);return t.status(201).json(r)}return e.file&&
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
c.get("/:userid",d.requiresAuthentication,(0,i.param)("userid").isMongoId(),(async(e,t,r)=>{const a=(0,i.validationResult)(e);if(!a.isEmpty())return t.status(400).json({errors:a.array()});const n=e.params.userid;if("a"!==e.role&&n!==e.userId)t.status(403),r(new Error("Invalid authorization, can not get User."));else try{const e=await u.getUser(n);t.status(200).json(e)}catch(e){t.status(404),r(e)}})),
/**
 * @swagger
 * /api/users/user/{userid}:
 *   get:
 *     summary: "Get User without admin"
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
c.get("/user/:userid",(0,i.param)("userid").isMongoId(),(async(e,t,r)=>{const a=(0,i.validationResult)(e);if(!a.isEmpty())return t.status(400).json({errors:a.array()});const n=e.params.userid;try{const e=await u.getUserInfo(n);t.status(200).json(e)}catch(e){t.status(404),r(e)}})),
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
 *               address[postalCode]:
 *                 type: string
 *                 example: "12345"
 *               address[city]:
 *                 type: string
 *                 example: "Berlin"
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
c.put("/:userid",d.requiresAuthentication,o.upload.single("profilePicture"),[(0,i.param)("userid").isMongoId()],(
// validate,
async(e,t,r)=>{const a=(0,i.validationResult)(e);if(!a.isEmpty())return e.file&&
// Delete the file
(0,o.deleteProfilePicture)(e.file.path),t.status(400).json({errors:a.array()});const n=e.params.userid;if("a"===e.role||n===e.userId){const r=await u.getUser(n);try{e.file&&(e.body.profilePicture=`/${e.file.filename}`,r.profilePicture&&(0,o.deleteProfilePicture)(r.profilePicture))}catch(r){(0,o.deleteProfilePicture)(e.body.profilePicture),t.status(404).json({Error:"Can not delete Profile picture - no such file or directory"})}}
//req.body.name = JSON.parse(req.body.name);
const s=e.body;//matchedData(req) as userResource;
if(s.id=n,"a"===e.role)try{const e=await u.updateUserWithAdmin(s);t.status(200).send(e)}catch(e){t.status(404),r(e)}else if(e.userId!==n)t.status(403),r(new Error("Invalid authorization, can not update user."));else{
// To delete Profile picture in settings page
try{if(console.log("req.body.deletePicture:",e.body.deletePicture),"true"===e.body.deletePicture&&(console.log("req.body.deletePicture: True"),s.profilePicture)){let e;(0,o.deleteProfilePicture)(s.profilePicture);const r=await u.updateUserWithPw(s,e);t.status(200).send(r)}}catch(e){t.status(404).json({Error:"Can not delete Profile picture - no such file or directory"})}try{let r;e.body.oldPassword&&(r=e.body.oldPassword),console.log("oldPw:",r);const a=await u.updateUserWithPw(s,r);t.status(200).send(a)}catch(e){t.status(403),r(new Error("Invalid authorization, probably invalid password."))}}})),
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
c.delete("/:userid",d.requiresAuthentication,(0,i.param)("userid").isMongoId(),(async(e,t,r)=>{const a=e.params.userid;try{if("a"===e.role){const e=await u.getUser(a),r=await u.deleteUser(a,!1);try{e.profilePicture&&(0,o.deleteProfilePicture)(e.profilePicture)}catch(e){t.status(404).json({Error:"Can not delete Profile picture - no such file or directory"})}t.status(204).send(r)}else if(e.userId===a){const e=await u.getUser(a),r=await u.deleteUser(a,!0);try{e.profilePicture&&(0,o.deleteProfilePicture)(e.profilePicture)}catch(e){t.status(404).json({Error:"Can not delete Profile picture - no such file or directory"})}t.status(204).send(r)}else t.send(403),r(new Error("Invalid authorization, can not delete user."))}catch(e){t.send(404),r(new Error("Probably invalid userid, can not delete user."))}})),t.default=c},
/***/562:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const n=a(r(860)),i=r(105),s=n.default.Router(),o=new i.UserService;
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
/**
UsersRouter.get("/users", requiresAuthentication, async (req, res, next) => {
  if (req.role !== "a") {
    res.status(403);
    next(new Error("Invalid authorization"));
  } else {
    try {
      const users: usersResource = await userService.getUsers();
      res.status(200).send(users);
    } catch (err) {
      res.status(404);
      next(err);
    }
  }
});
 */
/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: "Get Users not Admin"
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
s.get("/users",(async(e,t,r)=>{try{const e=await o.getUsersNotAdmin();t.status(200).send(e)}catch(e){t.status(404),r(e)}})),t.default=s},
/***/468:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.optionalAuthentication=t.requiresAuthentication=void 0;const a=r(829);
/**
 * Prüft Authentifizierung und schreibt `userId` mit Mongo-ID des Users und `role` mit Kürzel der Rolle in den Request.
 * Falls Authentifizierung fehlschlägt, wird ein Fehler (401) erzeugt.
 */t.requiresAuthentication=async function(e,t,r){try{const n=e.headers.authorization;if(n&&n.startsWith("Bearer ")){const i=n.substring(7),{userId:s,role:o}=(0,a.verifyJWT)(i);if(!s||!o)return t.status(401),r(new Error("Authentication Failed"));e.userId=s,e.role=o,r()}else t.status(401),t.setHeader("WWW-Authenticate",["Bearer",'realm="app"']),r(new Error("authentication required!"))}catch(e){t.status(401),t.setHeader("WWW-Authenticate",["Bearer",'realm="app"','error="invalid_token"']),r(e)}},t.optionalAuthentication=
/**
 * Prüft Authentifizierung und schreibt `userId` mit Mongo-ID des Users und `role` mit Kürzel der Rolle in den Request.
 * Falls kein JSON-Web-Token im Request-Header vorhanden ist, wird kein Fehler erzeugt (und auch nichts in den Request geschrieben).
 * Falls Authentifizierung fehlschlägt, wird ein Fehler (401) erzeugt.
 */
async function(e,t,r){const n=e.headers.authorization;if(n)try{const i=n.split(" ")[1],{userId:s,role:o}=(0,a.verifyJWT)(i);if(!s||!o)return t.status(401),r(new Error("Authentication Failed"));e.userId=s,e.role=o,r()}catch(e){t.status(401),r(e)}else r()}}
/***/,
/***/11:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const n=a(r(860)),i=r(553),s=r(829),o=n.default.Router();
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
o.post("/",(0,i.body)("email").isEmail(),(0,i.body)("password").isStrongPassword(),(async(e,t,r)=>{const a=(0,i.validationResult)(e);if(!a.isEmpty())return t.status(400).json({errors:a.array()});
//const loginResource = matchedData(req) as LoginResource;
const n=(0,i.matchedData)(e),o=await(0,s.verifyPasswordAndCreateJWT)(n.email,n.password);o||(t.status(401),r(new Error("no jwtstring")));const d={access_token:o,token_type:"Bearer"};t.send(d)})),t.default=o},
/***/659:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ChatService=void 0;const a=r(924),n=r(95),i=r(893);t.ChatService=class{async getChat(e){if(!e)throw new Error(`Chat ID: ${e} is invalid.`);const t=await a.Chat.findById(e).exec();if(!t)throw new Error("Chat not found");return{id:t.id,event:t.event.toString(),messages:await Promise.all(t.messages.map((async e=>{const t=await n.User.findById(e.user);return{user:e.user.toString(),username:`${t.name.first} ${t.name.last}`,message:e.message.toString(),time:(0,i.dateToStringWithTime)(e.time)}})))}}async sendMessage(e,t,r){if(!e)throw new Error(`Chat ID: ${e} is invalid.`);const s=await a.Chat.findById(e).exec();if(!s)throw new Error("Chat not found");const o=await n.User.findById(t).exec();if(!o)throw new Error("User not found");const d=await a.Event.findById(s.event).exec();if(!d)throw new Error("Event not found");if(!d.participants.includes(o._id))throw new Error("User is not participating in the event");s.messages.push({user:o._id,message:r,time:new Date});const c=await s.save();return{id:c.id,event:c.event.toString(),messages:await Promise.all(c.messages.map((async e=>{const t=await n.User.findById(e.user);return{user:e.user.toString(),username:`${t.name.first} ${t.name.last}`,message:e.message.toString(),time:(0,i.dateToStringWithTime)(e.time)}})))}}}}
/***/,
/***/282:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CommentService=void 0;const a=r(185),n=r(439),i=r(95),s=r(893),o=r(924);t.CommentService=class{
/**
     * finds all existing comments,
     * fills in creator and event name by populating documents.
     * skip and delete invalid comments before returning all comments?
     * (comments where event/creator is invalid/missing are invalid).
     * @returns all existing comments
     */
async getComments(){const e=await n.Comment.find({}).populate("creator","name").populate("event","name").exec(),t=[],r=e.filter((e=>!(!e.event||!e.creator)||(t.push(this.deleteComment(e.id)),!1)));await Promise.all(t);return{comments:r.map((e=>({id:e.id,title:e.title,stars:e.stars,content:e.content,createdAt:(0,s.dateToString)(e.createdAt),creator:e.creator._id.toString(),creatorName:e.creator.name,event:e.event._id.toString(),eventName:e.event.name,edited:e.edited})))}}
/**
     * populates the name of the event and sets the creatorName of every comment of the user.
     * @param userId specifies the user
     * @returns array of all comments from a user
     */async getCommentsOfUser(e){const t=await i.User.findById(e);if(!t)throw new Error(`Invalid userId ${e}, can not find Comment!`);const r=await n.Comment.find({creator:t.id}).populate("event","name").exec(),a=[],o=r.filter((e=>!!e.event||(a.push(this.deleteComment(e.id)),!1)));await Promise.all(a);return{comments:o.map((e=>({id:e.id,title:e.title,stars:e.stars,content:e.content,createdAt:(0,s.dateToString)(e.createdAt),creator:t.id,creatorName:t.name,event:e.event._id.toString(),eventName:e.event.name,edited:e.edited})))}}async getCommentsOfEvent(e){const t=await o.Event.findById(e);if(!t)throw new Error(`Invalid eventId ${e}, can not find Comment!`);const r=await n.Comment.find({event:t.id}).populate("creator","name").exec(),a=[],i=r.filter((e=>!!e.creator||(a.push(this.deleteComment(e.id)),!1)));await Promise.all(a);return{comments:i.map((e=>({id:e.id,title:e.title,stars:e.stars,content:e.content,createdAt:(0,s.dateToString)(e.createdAt),creator:e.creator._id.toString(),creatorName:e.creator.name,event:t.id,eventName:t.name,edited:e.edited})))}}
/**
     * used to create comments.
     * Every user can only post one comment for each event.
     * @param comment describes the comment
     * @returns the created comment with additional information (creatorName, eventName and date of creation).
     */async createComment(e){if(await n.Comment.findOne({creator:e.creator,event:e.event}))throw new Error("User has already submitted a comment for this event.");const t=await i.User.findById(e.creator),r=await o.Event.findById(e.event);if(!t)throw new Error(`No creator with id: ${e.creator} exists, can not create comment.`);if(!r)throw new Error(`No event with id: ${e.event} exists, can not create comment.`);const a=await n.Comment.create({title:e.title,stars:e.stars,content:e.content,creator:t.id,creatorName:t.name,event:r.id,eventName:r.name});return{id:a.id,title:a.title,stars:a.stars,content:a.content,creator:t.id,creatorName:t.name,event:r.id,eventName:r.name,createdAt:(0,s.dateToString)(a.createdAt),edited:a.edited}}
/**
     * Updated ein Kommentar. Es können nur title, stars und content aktualisiert werden.
     * Edited wird auf true gesetzt.
     */async updateComment(e){if(!e.id)throw new Error("CommentId missing, can not update.");const t=await n.Comment.findById(e.id).exec();if(!t)throw new Error(`No comment with id: ${e.id} exists, can not update comment.`);const r=await i.User.findById(t.creator).exec(),a=await o.Event.findById(t.event).exec(),d=await i.User.findById(e.creator),c=await o.Event.findById(e.event);if(!d)throw new Error(`No creator with id: ${e.creator} exists, can not update comment.`);if(!c)throw new Error(`No event with id: ${e.event} exists, can not update comment.`);e.title&&e.title!=t.title&&(t.title=e.title,t.edited=!0),e.stars&&e.stars!=t.stars&&(t.stars=e.stars,t.edited=!0),e.content&&e.content!=t.content&&(t.content=e.content,t.edited=!0);const u=await t.save();return{id:u.id,title:u.title,stars:u.stars,content:u.content,edited:u.edited,createdAt:(0,s.dateToString)(u.createdAt),creator:r.id,creatorName:r.name,event:a.id,eventName:a.name}}
/**
     * Deletes comment and all ratings of said comment.
     * @param id comment to be deleted.
     */async deleteComment(e){if(!e)throw new Error("CommentId missing, can not delete.");if(!await n.Comment.findById(e).exec())throw new Error(`Comment ${e} does not exist, can not delete.`);await n.Comment.deleteOne({_id:new a.Types.ObjectId(e)}).exec()}
/**
     * used to delete all comments of a user who gets deleted.
     * comments of non exisiting users are not needed and are getting deleted.
     * @param userId identifies creator of comments
     */async deleteCommentsOfUser(e){
/*
        if (!userId) {
            throw new Error(`UserId missing, can not delete comments of user.`);
        }
        const user = await User.findById(userId).exec();
        if (!user) {
            throw new Error(`User with id: ${userId} does not exist, can not delete comments of user`);
        }
        
        await Comment.deleteMany({ creator:user._id }).exec();
        */
await n.Comment.deleteMany({creator:e}).exec()}
/**
     * used to delete all Comments of a event that gets removed from database.
     * comments of non existing events are not needed and are getting deleted.
     * @param eventId specifies the event of which comments to be deleted.
     */async deleteCommentsOfevent(e){
/*
        if (!eventId) {
            throw new Error(`eventId missing, can not delete comments of event.`);
        }
        const event = await event.findById(eventId).exec();
        if (!event) {
            throw new Error(`event with id: ${eventId} does not exist, can not delete comments of event`);
        }
        
        await Comment.deleteMany({ event:event._id }).exec();
        */
await n.Comment.deleteMany({event:e}).exec()}
/**
     * used to calculate the average rate for Event.
     * If no comments found, return 0 as the average rating
     * @param eventId identifies Event
     * @returns the Average rate of Event as a Number
     */async getAverageRatingForEvent(e){const t=await n.Comment.find({event:e}).exec();if(!t||0===t.length)return 0;return t.reduce(((e,t)=>e+t.stars),0)/t.length}}}
/***/,
/***/682:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EventService=void 0;const a=r(185),n=r(924),i=r(95),s=new(r(282).CommentService);class o{
/**
     * Event erstellen
     */
async createEvent(e,t){try{const r=await i.User.findById(t),a=await n.Chat.create({messages:[]}),s=await n.Event.create({name:e.name,creator:r.id,description:e.description,price:e.price,date:e.date,address:e.address,thumbnail:e.thumbnail,hashtags:e.hashtags,category:e.category,chat:a.id,participants:[t]});return a.event=s._id,await a.save(),{id:s.id,name:s.name,creator:s.creator.toString(),creatorName:r.name,description:s.description,price:s.price,date:s.date,address:s.address,thumbnail:s.thumbnail,hashtags:s.hashtags,category:s.category,chat:s.chat.toString(),participants:s.participants.map((e=>e.toString()))}}catch(e){throw console.log(e),new Error("Event creation failed")}}
/**
     * Ein bestimmtes Event abrufen
     */async getEvent(e){try{const t=await n.Event.findById(e).exec();if(!t)throw new Error("Event not found");const r=await i.User.findById(t.creator).exec();if(!r)throw new Error("Creator of Event does not exist.");return{id:t.id,name:t.name,creator:t.creator.toString(),creatorName:r.name,description:t.description,price:t.price,date:t.date,address:t.address,thumbnail:t.thumbnail,hashtags:t.hashtags,category:t.category,chat:t.chat.toString(),participants:t.participants.map((e=>e.toString()))}}catch(e){throw new Error("Error getting event")}}
/**
     * Alle erstellten Events abrufen ( Event Manager / Admin )
     */async getEvents(e){if(!e)throw new Error("Can not get creator, userID is invalid");try{const t=await n.Event.find({creator:e}).exec();return{events:t.map((e=>({id:e.id,name:e.name,creator:e.creator.toString(),description:e.description,price:e.price,date:e.date,address:e.address,thumbnail:e.thumbnail,hashtags:e.hashtags,category:e.category,chat:e.chat.toString(),participants:e.participants.map((e=>e.toString()))})))}}catch(e){throw new Error("Error getting events")}}
/**
     * Alle Events abrufen
     */async getAllEvents(){try{const e=await n.Event.find({}).exec();return{events:e.map((e=>({id:e.id,name:e.name,creator:e.creator.toString(),description:e.description,price:e.price,date:e.date,address:e.address,thumbnail:e.thumbnail,hashtags:e.hashtags,category:e.category,chat:e.chat.toString(),participants:e.participants.map((e=>e.toString()))})))}}catch(e){throw new Error("Error getting events")}}
/**
     * Events filtern / Event suchen
     */async searchEvents(e){if(!e||0===e.trim().length)return this.getAllEvents();try{const t=await n.Event.find({$or:[{name:{$regex:new RegExp(e,"i")}},{description:{$regex:new RegExp(e,"i")}},{hashtags:{$in:[new RegExp(e,"i")]}}]}).exec();return{events:t.map((e=>({id:e.id,name:e.name,creator:e.creator.toString(),description:e.description,price:e.price,date:e.date,address:e.address,thumbnail:e.thumbnail,hashtags:e.hashtags,category:e.category,chat:e.chat.toString(),participants:e.participants.map((e=>e.toString()))})))}}catch(e){throw new Error("Error searching events")}}
/**
     * Am Event teilnehmen ( Event Teilnehmer )
     */async joinEvent(e,t){if(!e)throw new Error(`User ID: ${e} is invalid.`);if(!t)throw new Error(`Event ID: ${t} is invalid.`);const r=await i.User.findById(e).exec(),a=await n.Event.findById(t).exec();if(!r)throw new Error("User not found");if(!a)throw new Error("Event not found");if(a.participants.includes(r._id))throw new Error("User is already participating in the event");try{return a.participants.push(r._id),await a.save(),!0}catch(e){return!1}}
/**
     * Alle teilgenommenen Events abrufen ( Event Teilnehmer )
     */async getJoinedEvents(e){try{const t=await n.Event.find({participants:e}).exec();return{events:t.map((e=>({id:e.id,name:e.name,creator:e.creator.toString(),description:e.description,price:e.price,date:e.date,address:e.address,thumbnail:e.thumbnail,hashtags:e.hashtags,category:e.category,chat:e.chat.toString(),participants:e.participants.map((e=>e.toString()))})))}}catch(e){throw new Error("Error getting events")}}
/**
     * Teilnahme am Event absagen ( Event Teilnehmer )
     */async cancelEvent(e,t){if(!e)throw new Error(`User ID: ${e} is invalid.`);if(!t)throw new Error(`Event ID: ${t} is invalid.`);const r=await n.Event.findById(t).exec();if(!r)throw new Error("Event not found");if(r.creator&&r.creator.toString()===e)throw new Error("Can not cancel participation as event manager");const i=r.participants.findIndex((t=>t.equals(new a.Types.ObjectId(e))));if(-1===i)throw new Error("User is not participating in the event");try{return r.participants.splice(i,1),await r.save(),!0}catch(e){return!1}}
/**
     * Alle Teilnehmer vom Event abrufen ( Event Manager / Admin )
     */async getParticipants(e,t){try{const r=await n.Event.findById(e).exec();if(!r)throw new Error("Event not found");const a=await i.User.findById(r.creator).exec(),s=await i.User.findById(t);if(!a||!s||a.id!==t&&!s.isAdministrator)throw new Error("Invalid authorization");const o=r.participants,d={users:(await i.User.find({_id:{$in:o}}).exec()).map((e=>({id:e.id,name:e.name,email:e.email,isAdministrator:e.isAdministrator,address:e.address,profilePicture:e.profilePicture,birthDate:e.birthDate,gender:e.gender,socialMediaUrls:e.socialMediaUrls,isActive:e.isActive})))};return d}catch(e){throw new Error("Error getting participants")}}
/**
     * Event bearbeiten ( Event Manager / Admin )
     */async updateEvent(e,t,r){const a=await n.Event.findById(e).exec();if(!a)throw new Error("Event not found");const s=await i.User.findById(a.creator).exec(),o=await i.User.findById(r).exec();if(!s||!o||s._id.toString()!==r&&!o.isAdministrator)throw new Error("Invalid authorization");if(t.name&&(a.name=t.name),t.description&&(a.description=t.description),void 0!==t.price){if(t.price<0)throw new Error("Event price cannot be less than 0");0===t.price?a.price=0:a.price=t.price}t.date&&(a.date=t.date),t.address&&(a.address=t.address),t.thumbnail&&(a.thumbnail=t.thumbnail),t.hashtags&&(a.hashtags=t.hashtags),t.category&&(a.category=t.category);const d=await a.save();return{id:d.id,name:d.name,creator:d.creator.toString(),description:d.description,price:d.price,date:d.date,address:d.address,thumbnail:d.thumbnail,hashtags:d.hashtags,category:d.category,chat:d.chat.toString(),participants:d.participants.map((e=>e.toString()))}}
/**
     * Event löschen ( Event Manager / Admin )
     */async deleteEvent(e,t){try{const r=await n.Event.findById(e).exec();if(!r)throw new Error("Event not found");const a=await i.User.findById(r.creator).exec(),o=await i.User.findById(t).exec();if(!a||!o||a._id.toString()!==t&&!o.isAdministrator)throw new Error("Invalid authorization");await n.Chat.deleteOne({_id:r.chat}).exec();return 1===(await n.Event.deleteOne({_id:e}).exec()).deletedCount&&(await s.deleteCommentsOfevent(e),!0)}catch(e){throw new Error("Error deleting event")}}}t.EventService=o,t.default=new o}
/***/,
/***/829:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.verifyJWT=t.verifyPasswordAndCreateJWT=void 0;const n=r(344),i=r(95);a(r(142)).default.config(),t.verifyPasswordAndCreateJWT=
/**
 * @param email E-Mail-Adresse des Users
 * @param password Das Passwort des Users
 * @returns JWT als String, im JWT ist sub gesetzt mit der Mongo-ID des Users als String sowie role mit "u" oder "a" (User oder Admin);
 *      oder undefined wenn Authentifizierung fehlschlägt.
 */
async function(e,t){const r=await i.User.find({email:e,isActive:!0}).exec();if(!r||1!=r.length)return;const a=r[0];if(!await a.isCorrectPassword(t))return;const s=process.env.JWT_SECRET;if(!s)throw new Error("JWT_SECRET not set");const o=Math.floor(Date.now()/1e3);if(!process.env.JWT_TTL)throw new Error("TTL not set");const d=o+86400,c=a.isAdministrator?"a":"u",u={sub:a.id,iat:o,exp:d,role:c};return(0,n.sign)(u,s,{algorithm:"HS256"})},t.verifyJWT=
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
function(e){var t;if(!e)throw new Error("No JWT-string");const r=process.env.JWT_SECRET;if(!r)throw new Error("JWT_SECRET not set");try{const a=(0,n.verify)(e,r);if("object"==typeof a&&"sub"in a&&a.sub){return{userId:null===(t=a.sub)||void 0===t?void 0:t.toString(),role:a.role}}}catch(e){throw new Error("verify_error")}throw new Error("invalid_token")}},
/***/980:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RatingService=void 0;const a=r(95),n=r(439),i=r(467),s=r(185);t.RatingService=class{async getRatingsOfComment(e){const t=await n.Comment.findById(e).exec();if(!t)throw new Error(`No comment with id: ${e} of rating found.`);return{ratings:(await i.Rating.find({comment:e}).exec()).map((e=>({id:e.id,comment:t.id,creator:e.creator.toString(),ratingType:e.ratingType})))}}async createRating(e){const t=await a.User.findById(e.creator).exec();if(!t)throw new Error(`No creator with id: ${e.creator} of rating found. Can not create Rating.`);const r=await n.Comment.findById(e.comment).exec();if(!r)throw new Error(`No comment with id: ${e.comment} of rating found. Can not create Rating.`);if(t.id==r.creator)throw new Error("Users cannot rate their own comments.");if((await i.Rating.find({comment:r.id,creator:t.id}).exec()).length>0)throw new Error("Already rated this comment.");const s=await i.Rating.create(e);return Object.assign(Object.assign({},e),{id:s.id})}async updateRating(e){if(!e.id)throw new Error(`No ratingId:${e.id} found, can not update rating`);const t=await i.Rating.findById(e.id).exec();if(!t)throw new Error(`No rating with id:${e.id} found, can not update rating`);const r=await a.User.findById({_id:new s.Types.ObjectId(e.creator)}).exec();if(!r)throw new Error(`No creator with id: ${e.creator} of rating found. Can not update rating.`);const o=await n.Comment.findById({_id:new s.Types.ObjectId(e.comment)}).exec();if(!o)throw new Error(`No comment with id: ${e.comment} of rating found. Can not update rating.`);if(t.creator!=r.id||t.comment!=o.id)throw new Error("userID or commentID does not match.");e.ratingType&&(t.ratingType=e.ratingType);const d=await t.save();return{id:d.id,comment:d.comment.toString(),creator:d.creator.toString(),ratingType:d.ratingType}}async deleteRating(e){if(!e)throw new Error("RatingId missing, can not delete.");if(1!==(await i.Rating.deleteOne({_id:new s.Types.ObjectId(e)}).exec()).deletedCount)throw new Error(`No rating with id ${e} deleted, probably id not valid`)}async deleteRatingsOfUser(e){if(!e)throw new Error("UserId missing, can not delete.");if(!await a.User.findById(e).exec())throw new Error(`User with id: ${e} missing, can not delete.`);await i.Rating.deleteMany({creator:e}).exec()}async deleteRatingsOfComment(e){if(!e)throw new Error("CommentId missing, can not delete.");if(!await n.Comment.findById(e).exec())throw new Error(`Comment with id: ${e} missing, can not delete.`);await i.Rating.deleteMany({comment:new s.Types.ObjectId(e)}).exec()}}}
/***/,
/***/893:
/***/(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.dateToStringWithTime=t.dateToString=void 0,t.dateToString=function(e){return`${e.getDate()}.${e.getMonth()+1}.${e.getFullYear()}`},t.dateToStringWithTime=function(e){const t=e.getDate(),r=e.getMonth()+1,a=e.getFullYear(),n=e.getHours(),i=e.getMinutes();return`${t<10?`0${t}`:`${t}`}.${r<10?`0${r}`:`${r}`}.${a} ${n<10?`0${n}`:`${n}`}:${i<10?`0${i}`:`${i}`}`}}
/***/,
/***/105:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UserService=void 0;const a=r(95),n=new(r(282).CommentService);class i{async registerUser(e){if(!e||"object"!=typeof e)throw new Error("Invalid user data");
// Check if the user already exists in the database
const{email:t}=e;if(await a.User.findOne({email:t}))throw new Error("User already exists");
// Create a new user
try{return await a.User.create(e)}catch(e){throw new Error("Registration failed")}}async getUsers(){return{users:(await a.User.find({}).exec()).map((e=>({id:e.id,name:e.name,email:e.email,isAdministrator:e.isAdministrator,address:e.address,profilePicture:e.profilePicture,birthDate:e.birthDate,gender:e.gender,socialMediaUrls:e.socialMediaUrls,isActive:e.isActive})))}}async getUsersNotAdmin(){return{users:(await a.User.find({}).exec()).map((e=>({id:e.id,name:e.name,profilePicture:e.profilePicture,isActive:e.isActive})))}}async getUser(e){if(!e)throw new Error("Can not get user, userID is invalid");const t=await a.User.findOne({_id:e,isActive:!0}).exec();if(!t)throw new Error(`No user with id: ${e} exists.`);return{id:t.id,name:t.name,email:t.email,isAdministrator:t.isAdministrator,address:t.address,profilePicture:t.profilePicture,birthDate:t.birthDate,gender:t.gender,socialMediaUrls:t.socialMediaUrls,isActive:t.isActive}}async getUserInfo(e){if(!e)throw new Error("Can not get user, userID is invalid");const t=await a.User.findOne({_id:e}).exec();if(!t)throw new Error(`No user with id: ${e} exists.`);return{id:t.id,name:t.name,profilePicture:t.profilePicture,isActive:t.isActive}}
/**
     * used to prefill db with standard admin user. Therefore this servicemethod does not need an endpoint.
     * @param userResource
     * @returns userResource
     */async createUser(e){const t=await a.User.create({name:e.name,email:e.email,isAdministrator:e.isAdministrator,address:e.address,password:e.password,profilePicture:e.profilePicture,birthDate:e.birthDate,gender:e.gender,socialMediaUrls:e.socialMediaUrls});return{id:t.id,name:t.name,email:t.email,isAdministrator:t.isAdministrator,address:t.address,profilePicture:t.profilePicture,birthDate:t.birthDate,gender:t.gender,socialMediaUrls:t.socialMediaUrls,isActive:t.isActive}}
/**
     * Admin function to update userdata. can update password & isAdministrator.
     * @param userResource
     * @returns userResource of updated user.
     */async updateUserWithAdmin(e){if(!e.id)throw new Error("User id is missing, cannot update User.");const t=await a.User.findById(e.id).exec();if(!t)throw new Error(`No user with id: ${e.id} found, cannot update`);for(const r in e)if(e.hasOwnProperty(r)){if("oldPassword"===r)continue;"name"===r?(t.name.first=e.name.first,t.name.last=e.name.last):t[r]=e[r],"address"===r?(t.address.postalCode=e.address.postalCode,t.address.city=e.address.city):t[r]=e[r]}return await t.save()}async updateUserWithPw(e,t){if(!e.id)throw new Error("User id is missing, cannot update User.");const r=await a.User.findById(e.id).exec();if(!r)throw new Error(`No user with id: ${e.id} found, cannot update`);if(console.log("user:",r),t){console.log("oldPw");if(!await r.isCorrectPassword(t))throw new Error("Invalid oldPassword, cannot update User!")}console.log("userResource:",e);for(const t in e)console.log("property:",t),"oldPassword"!==t&&("Password"===t?(console.log("userResource.password:",e[t]),r.password=e[t],console.log("user.password:",r.password)):"deletePicture"===t?r.profilePicture="":r[t]=e[t]);return await r.save()}
/**
     * This function is used to either disable a user account or to delete the account from the database.
     * If the logged-in user is an admin (role in req.role === "a") and performs the "delete" endpoint request,
     * inactivateAccount is set to false, and the user is deleted from the database.
     * Otherwise, the user himself deactivates his account, and inactivateAccount is set to true.
     * @param userID The ID of the user to be deactivated or deleted.
     * @param inactivateAccount If true, user.isActive is set to false and the user object remains in the database; otherwise, the admin deletes the user from the database.
     * @returns true if the user was deleted or inactivated, false if no user was deleted.
     */async deleteUser(e,t){if(!e)throw new Error("invalid userID, can not delete/inactivate account");const r=await a.User.findOne({_id:e}).exec();if(!r)throw new Error("User not found, probably invalid userID or user is already deleted");if(t){r.isActive=!1;return!(await r.save()).isActive}return 1===(await a.User.deleteOne({_id:e})).deletedCount&&(await n.deleteCommentsOfUser(e),!0)}}t.UserService=i,t.default=new i}
/***/,
/***/993:
/***/(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});const a=r(95);t.default=async()=>{let e={email:"admin.team@connectandexplore.com",name:{first:"admin",last:"team"},password:"k.9MSn#JJh+§3F3a",isAdministrator:!0,address:{postalCode:"12345",city:"Berlin"},birthDate:new Date,gender:"male",isActive:!0,socialMediaUrls:{facebook:"facebook.com",instagram:"instagram.com"}};try{await a.User.create(e)}catch(e){console.error("Error creating admin user:",e)}}}
/***/,
/***/0:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.upload=t.deleteEventThumbnail=t.deleteProfilePicture=void 0;const n=a(r(738)),i=a(r(17)),s=a(r(231)),o=r(828),d=n.default.diskStorage({destination:function(e,t,r){const a=
// This function is created with chatgpt
function(e){
//const uploadPath = process.env.UPLOAD_PATH || "uploads"; // Get upload path from .env file or use default 'uploads'
const t="uploads",r=i.default.join(__dirname,"../../Backend");// Assuming 'FileUpload.ts' is in the 'utils' directory
return"profilePicture"===e?i.default.join(r,t,"users"):"thumbnail"===e?i.default.join(r,t,"events"):i.default.join(r,t)}(t.fieldname);
// Check if the folder exists, create it if it doesn't
s.default.existsSync(a)||s.default.mkdirSync(a,{recursive:!0}),r(null,a)},filename:function(e,t,r){r(null,`${(0,o.v4)()}-${t.originalname}`)}});t.deleteProfilePicture=function(e){try{const t=i.default.join(__dirname,"../../Backend","uploads/users",e);// Assuming 'FileUpload.ts' is in the 'utils' directory
console.log("fullPath:",t),s.default.unlinkSync(t),console.log("file deleted",t)}catch(e){throw e}},t.deleteEventThumbnail=function(e){try{const t=i.default.join(__dirname,"../../Backend","uploads/events",e);// Assuming 'FileUpload.ts' is in the 'utils' directory
console.log("fullpath image Event:",t),s.default.unlinkSync(t)}catch(e){throw e}},
// file size : 10 MB limit
t.upload=(0,n.default)({storage:d,fileFilter:(e,t,r)=>{"image/jpg"===t.mimetype||"image/jpeg"===t.mimetype||"image/png"===t.mimetype?r(null,!0):r(new Error("Image uploaded is not of type jpg/jpeg or png"),!1)},limits:{fileSize:10485760}})},
/***/653:
/***/function(e,t,r){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const n=a(r(682)),i=r(105);t.default=async()=>{const e={postalCode:"54321",city:"Berlin"},t={email:"John@some-host.de",name:{first:"John",last:"Doe"},password:"12abcAB!",isAdministrator:!1,address:e,birthDate:new Date("2000-06-14"),gender:"male",isActive:!0},r={email:"Jane@some-host.de",name:{first:"Jane",last:"Doe"},password:"12abcAB!",isAdministrator:!1,address:e,birthDate:new Date("2000-04-10"),gender:"female",isActive:!0},a=new i.UserService,s=await a.createUser(t),o=await a.createUser(r),d={name:"Summer Music Festival",description:"Ein großes Festival mit verschiedenen Musikgenres und lokalen Künstlern.",price:50,date:new Date("2024-06-21"),address:{street:"Musikstraße",houseNumber:"1",city:"Berlin",postalCode:"10115",country:"Deutschland"},category:[{name:"Music",description:"Music Event"}],hashtags:["party","Party","food","Food"]},c={name:"Street Food Market",description:"Eine kulinarische Reise durch die Street Food Kulturen der Welt.",price:10,date:new Date("2024-07-10"),address:{street:"Gourmetplatz",houseNumber:"5",city:"Hamburg",postalCode:"20095",country:"Deutschland"},hashtags:["Food","food"]},u={name:"Coding Workshop",description:"Ein interaktiver Workshop für Anfänger im Programmieren.",price:0,date:new Date("2024-08-15"),address:{street:"Techweg",houseNumber:"3",city:"München",postalCode:"80331",country:"Deutschland"}},l={name:"Yoga im Park",description:"Entspannende Yoga-Sessions im Freien für alle Niveaus.",price:15,date:new Date("2024-05-25"),address:{street:"Grünallee",houseNumber:"2",city:"Köln",postalCode:"50678",country:"Deutschland"}},m={name:"Kunstausstellung Modern Art",description:"Entdecken Sie moderne Kunstwerke lokaler Künstler.",price:20,date:new Date("2024-09-30"),address:{street:"Künstlerstraße",houseNumber:"4",city:"Frankfurt",postalCode:"60311",country:"Deutschland"},category:[{name:"Art",description:"Art Event"}]};await n.default.createEvent(d,s.id),await n.default.createEvent(c,s.id),await n.default.createEvent(u,s.id),await n.default.createEvent(l,o.id),await n.default.createEvent(m,o.id)}},
/***/811:
/***/function(e,t,r){
// Copyrights Code: https://github.com/TomDoesTech/REST-API-Tutorial-Updated/blob/main/src/utils/swagger.ts
var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const n=a(r(777)),i=a(r(948)),s={definition:{openapi:"3.1.0",info:{title:"Explore and Connect REST API Docs",version:r(147).version},components:{securitySchemes:{bearerAuth:{type:"http",scheme:"bearer",bearerFormat:"JWT"}},schemas:{IAddress:{type:"object",properties:{postalCode:{type:"string"},city:{type:"string"}}},IEAddress:{type:"object",properties:{street:{type:"string"},houseNumber:{type:"string"},apartmentNumber:{type:"string"},postalCode:{type:"string"},city:{type:"string"},stateOrRegion:{type:"string"},country:{type:"string"}}},ICategory:{type:"object",properties:{name:{type:"string"},description:{type:"string"}}},IChat:{type:"object",properties:{}},IUser:{type:"object",properties:{email:{type:"string"},name:{type:"object",properties:{first:{type:"string"},last:{type:"string"}}},password:{type:"string"},isAdministrator:{type:"boolean"},address:{$ref:"#/components/schemas/IAddress"},profilePicture:{type:"string"},birthDate:{type:"date",format:"date"},gender:{type:"string"},socialMediaUrls:{type:"object",properties:{facebook:{type:"string"},instagram:{type:"string"}}},isActive:{type:"boolean"}}},IEvent:{type:"object",properties:{name:{type:"string"},creator:{$ref:"#/components/schemas/IUser"},description:{type:"string"},price:{type:"number",minimum:0},date:{type:"string",// Date represented as string in ISO 8601 format
format:"date-time"},address:{$ref:"#/components/schemas/IEAddress"},thumbnail:{type:"string"},hashtags:{type:"array",items:{type:"string"}},category:{type:"array",items:{$ref:"#/components/schemas/ICategory"}},chat:{$ref:"#/components/schemas/IChat"},participants:{type:"array",items:{type:"string"}}}},IComment:{type:"object",properties:{title:{type:"string"},stars:{type:"number",minimum:1,maximum:5},content:{type:"string"},edited:{type:"boolean"},creator:{$ref:"#/components/schemas/IUser"},event:{$ref:"#/components/schemas/IEvent"},createdAt:{type:"string",format:"date-time"}}}}},security:[{bearerAuth:[]}]},apis:["./src/routes/*.ts","./src/model/*.ts"]},o=(0,n.default)(s);t.default=function(e,t){
// Swagger page
e.use("/swagger/docs",i.default.serve,i.default.setup(o)),
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
/***/69:
/***/e=>{e.exports=require("socket.io");
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
/***/e=>{e.exports=JSON.parse('{"name":"backend","version":"1.0.0","description":"Backend for Connect & Explore","main":"server.js","scripts":{"test":"set PORT=0 && jest --config jest.config.js --forceExit --maxworkers=2 ","format":"prettier --write src tests","start":"npm run build && nodemon ./dist/bundle.js ","build":"webpack --mode production"},"repository":{"type":"git","url":"https://gitlab.bht-berlin.de/s85975/connectandexplore.git"},"keywords":["Express.js","MongoDB","NodeJS"],"author":"Mariam Daliri, Naceur Sayedi, Georg Sittnick, Khatia Zitanishvili , Minh Trinh, Christian Dahlenburg","license":"ISC","devDependencies":{"@types/bcryptjs":"^2.4.5","@types/express":"^4.17.21","@types/jest":"^29.5.8","@types/supertest":"^2.0.16","clean-webpack-plugin":"^4.0.0","copy-webpack-plugin":"^11.0.0","dotenv":"^16.3.1","glob":"^10.3.10","jest":"^29.7.0","jest-junit":"^16.0.0","mongodb-memory-server":"^9.0.1","nodemon":"^3.0.1","optimize-css-assets-webpack-plugin":"^6.0.1","supertest":"^6.3.3","terser-webpack-plugin":"^5.3.9","ts-jest":"^29.1.1","ts-loader":"^9.5.1","typescript":"^5.3.2","webpack":"^5.89.0","webpack-cli":"^5.1.4","webpack-node-externals":"^3.0.0"},"dependencies":{"@types/dotenv":"^8.2.0","@types/jsonwebtoken":"^9.0.5","@types/multer":"^1.4.9","@types/swagger-jsdoc":"^6.0.2","@types/swagger-ui-express":"^4.1.5","@types/uuid":"^9.0.7","axios":"^1.6.4","bcryptjs":"^2.4.3","body-parser":"^1.20.2","cors":"^2.8.5","express":"^4.18.2","express-validator":"^7.0.1","fs":"^0.0.1-security","https":"^1.0.0","jsonwebtoken":"^9.0.2","mongoose":"^7.6.5","multer":"^1.4.5-lts.1","prettier":"^3.0.3","socket.io":"^4.7.2","swagger-jsdoc":"^6.2.8","swagger-ui-express":"^5.0.0","ts-node":"^10.9.1"}}');
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
/******/function r(a){
/******/ // Check if module is in cache
/******/var n=t[a];
/******/if(void 0!==n)
/******/return n.exports;
/******/
/******/ // Create a new module (and put it into the cache)
/******/var i=t[a]={
/******/ // no module.id needed
/******/ // no module.loaded needed
/******/exports:{}
/******/};
/******/
/******/ // Execute the module function
/******/
/******/
/******/ // Return the exports of the module
/******/return e[a].call(i.exports,i,i.exports,r),i.exports;
/******/})(505);
/******/
/******/})();