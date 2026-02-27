import Text "mo:core/Text";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";
import Random "mo:core/Random";

// Add migration module for smooth upgrades of backend code with persistent state
(with migration = Migration.run)
actor {
  // Types used
  type Question = {
    question : Text;
    options : [Text];
    answer : Text;
    explanation : ?Text;
    questionHi : ?Text;
    optionsHi : ?[Text];
    explanationHi : ?Text;
  };

  // Added enum for ExamCategory
  type ExamCategory = {
    #upsc;
    #ssc;
    #railway;
    #banking;
    #bpsc;
    #stateExams;
  };

  type Test = {
    id : Nat;
    title : Text;
    questions : [Question];
    price : Nat;
    negativeMarkValue : Float;
    category : ExamCategory;
  };

  type ContactSubmission = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  type Ranker = {
    rank : Nat;
    studentName : Text;
    examCategory : Text;
    score : Nat;
  };

  module Ranker {
    public func compare(ranker1 : Ranker, ranker2 : Ranker) : Order.Order {
      Nat.compare(ranker1.rank, ranker2.rank);
    };
  };

  type Student = {
    id : Nat;
    mobileNumber : Text;
    password : Text;
    otp : ?Text;
    profilePhotoBase64 : ?Text;
    registeredAt : Time.Time;
  };

  type Slider = {
    id : Nat;
    imageUrl : Text;
    title : ?Text;
  };

  type CurrentAffairs = {
    id : Nat;
    date : Text;
    content : Text;
  };

  type Newspaper = {
    id : Nat;
    date : Text;
    link : Text;
  };

  // UserProfile for AccessControl-based identity system
  type UserProfile = {
    name : Text;
    email : ?Text;
  };

  let tests = Map.empty<Nat, Test>();
  let sliders = Map.empty<Nat, Slider>();
  let currentAffairs = Map.empty<Nat, CurrentAffairs>();
  let newspapers = Map.empty<Nat, Newspaper>();
  let contactSubmissions = Map.empty<Nat, ContactSubmission>();
  let students = Map.empty<Nat, Student>();
  let rankers = Map.fromIter<Nat, Ranker>([
    (1, { rank = 1; studentName = "Alice"; examCategory = "UPSC"; score = 98 }),
    (2, { rank = 2; studentName = "Bob"; examCategory = "BPSC"; score = 95 }),
    (3, { rank = 3; studentName = "Charlie"; examCategory = "SSC"; score = 93 }),
    (4, { rank = 4; studentName = "David"; examCategory = "Railway"; score = 90 }),
    (5, { rank = 5; studentName = "Eva"; examCategory = "State Exams"; score = 88 }),
    (6, { rank = 6; studentName = "Frank"; examCategory = "UPSC"; score = 87 }),
    (7, { rank = 7; studentName = "Grace"; examCategory = "BPSC"; score = 85 }),
    (8, { rank = 8; studentName = "Helen"; examCategory = "SSC"; score = 83 }),
    (9, { rank = 9; studentName = "Ivy"; examCategory = "Railway"; score = 81 }),
    (10, { rank = 10; studentName = "Jack"; examCategory = "State Exams"; score = 80 }),
  ].values());

  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextContactId = 1;
  var nextRankId = 11;
  var nextStudentId = 1;
  var nextSliderId = 1;
  var nextCurrentAffairsId = 1;
  var nextNewspaperId = 1;

  let adminUsername = "STSHubsachin";
  let adminPassword = "success@#2003";

  // Session record types and maps
  type StudentSession = {
    token : Text;
    studentId : Nat;
    expiration : Int;
  };

  var studentSessions = Map.empty<Text, StudentSession>();

  type AdminSession = {
    token : Text;
    expiration : Int;
  };

  let adminSessions = Map.empty<Text, AdminSession>();

  // ── Access Control Mixin ──────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // UserProfile (AccessControl-based identity) ──────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ADMIN AUTHENTICATION (token-based) ──────────────────────────

  public shared ({ caller }) func login(username : Text, password : Text) : async Text {
    if (username == adminUsername and password == adminPassword) {
      let token = await generateToken();
      let session : AdminSession = {
        token;
        expiration = Time.now() + 3600_000_000_000;
      };
      adminSessions.add(token, session);
      return token;
    } else {
      Runtime.trap("Invalid username or password");
    };
  };

  public query ({ caller }) func validateSession(token : Text) : async Bool {
    switch (adminSessions.get(token)) {
      case (?session) { Time.now() < session.expiration };
      case (null) { false };
    };
  };

  public shared ({ caller }) func logout(token : Text) : async () {
    adminSessions.remove(token);
  };

  // STUDENT AUTHENTICATION (password-based) ──────────────────────────

  public shared ({ caller }) func registerStudent(mobileNumber : Text, password : Text) : async () {
    if (mobileNumber.size() != 10) {
      Runtime.trap("Mobile number must be 10 digits");
    };

    let existingStudent = students.values().find(
      func(student) { student.mobileNumber == mobileNumber }
    );

    switch (existingStudent) {
      case (?_) { Runtime.trap("Mobile number already registered") };
      case (null) {
        let student : Student = {
          id = nextStudentId;
          mobileNumber;
          password;
          otp = null;
          profilePhotoBase64 = null;
          registeredAt = Time.now();
        };
        students.add(nextStudentId, student);
        nextStudentId += 1;
      };
    };
  };

  public shared ({ caller }) func studentLogin(mobileNumber : Text, password : Text) : async Text {
    switch (students.values().find(func(student) { student.mobileNumber == mobileNumber })) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        if (student.password != password) {
          Runtime.trap("Invalid password");
        };

        let token = await generateToken();
        let session : StudentSession = {
          token;
          studentId = student.id;
          expiration = Time.now() + 3600_000_000_000;
        };
        studentSessions.add(token, session);
        token;
      };
    };
  };

  public shared ({ caller }) func studentLogout(token : Text) : async () {
    studentSessions.remove(token);
  };

  // TEST MANAGEMENT (admin-only via token) ───────────────────────────

  public shared ({ caller }) func addTest(token : Text, title : Text, questions : [Question], price : Nat, negativeMarkValue : Float, category : ExamCategory) : async () {
    validateAdminSession(token);
    let id = tests.size() + 1;
    let test : Test = {
      id;
      title;
      questions;
      price;
      negativeMarkValue;
      category;
    };
    tests.add(id, test);
  };

  public shared ({ caller }) func updateTest(token : Text, id : Nat, title : Text, questions : [Question], price : Nat, negativeMarkValue : Float, category : ExamCategory) : async () {
    validateAdminSession(token);
    let test : Test = {
      id;
      title;
      questions;
      price;
      negativeMarkValue;
      category;
    };
    tests.add(id, test);
  };

  public shared ({ caller }) func deleteTest(token : Text, id : Nat) : async () {
    validateAdminSession(token);
    tests.remove(id);
  };

  public query ({ caller }) func getTestById(id : Nat) : async Test {
    switch (tests.get(id)) {
      case (null) { Runtime.trap("Test not found") };
      case (?test) { test };
    };
  };

  // ADMIN-ONLY: generate questions (requires valid admin session)
  public shared ({ caller }) func generateQuestions(token : Text, topic : Text, difficulty : Text) : async [Question] {
    validateAdminSession(token);
    let questions = Array.repeat(
      {
        question = "Sample question about " # topic # " (" # difficulty # ")";
        options = ["Option 1", "Option 2", "Option 3", "Option 4"];
        answer = "Option 1";
        explanation = ?("This is a sample explanation for the correct answer.");
        questionHi = ?("नमूना प्रश्न " # topic # " (" # difficulty # ") के बारे में");
        optionsHi = ?["विकल्प 1", "विकल्प 2", "विकल्प 3", "विकल्प 4"];
        explanationHi = ?("यह सही उत्तर के लिए नमूना स्पष्टीकरण है।");
      },
      5,
    );
    questions;
  };

  // RANKER MANAGEMENT (admin-only via token) ───────────────────────────

  public shared ({ caller }) func addRanker(token : Text, studentName : Text, examCategory : Text, score : Nat) : async () {
    validateAdminSession(token);
    let newRank = rankers.size() + 1;
    let newRanker : Ranker = {
      rank = newRank;
      studentName;
      examCategory;
      score;
    };
    rankers.add(nextRankId, newRanker);
    nextRankId += 1;
    reRank();
  };

  public shared ({ caller }) func deleteRanker(token : Text, rank : Nat) : async () {
    validateAdminSession(token);
    let filtered = rankers.filter(func(_, r) { r.rank != rank });
    rankers.clear();

    let newRankers = Map.fromArray<Nat, Ranker>(filtered.toArray());
    for ((id, ranker) in newRankers.entries()) {
      rankers.add(id, ranker);
    };
    reRank();
  };

  // CONTACT SUBMISSIONS ───────────────────────────

  // anyone can submit a contact form
  public shared ({ caller }) func submitContact(name : Text, email : Text, message : Text) : async () {
    let submission = {
      name;
      email;
      message;
      timestamp = Time.now();
    };
    contactSubmissions.add(nextContactId, submission);
    nextContactId += 1;
  };

  // SLIDER MANAGEMENT (admin-only via token) ──────

  // anyone can view sliders
  public query ({ caller }) func getSliders() : async [Slider] {
    sliders.values().toArray();
  };

  public shared ({ caller }) func addSlider(token : Text, imageUrl : Text, title : ?Text) : async () {
    validateAdminSession(token);
    let slider : Slider = {
      id = nextSliderId;
      imageUrl;
      title;
    };
    sliders.add(nextSliderId, slider);
    nextSliderId += 1;
  };

  public shared ({ caller }) func deleteSlider(token : Text, id : Nat) : async () {
    validateAdminSession(token);
    sliders.remove(id);
  };

  // CURRENT AFFAIRS MANAGEMENT (admin-only via token) ──────

  // anyone can view current affairs
  public query ({ caller }) func getCurrentAffairs() : async [CurrentAffairs] {
    currentAffairs.values().toArray();
  };

  public shared ({ caller }) func addCurrentAffairs(token : Text, date : Text, content : Text) : async () {
    validateAdminSession(token);
    let entry : CurrentAffairs = {
      id = nextCurrentAffairsId;
      date;
      content;
    };
    currentAffairs.add(nextCurrentAffairsId, entry);
    nextCurrentAffairsId += 1;
  };

  public shared ({ caller }) func deleteCurrentAffairs(token : Text, id : Nat) : async () {
    validateAdminSession(token);
    currentAffairs.remove(id);
  };

  // NEWSPAPER MANAGEMENT (admin-only via token) ──────

  // anyone can view newspapers
  public query ({ caller }) func getNewspapers() : async [Newspaper] {
    newspapers.values().toArray();
  };

  public shared ({ caller }) func addNewspaper(token : Text, date : Text, link : Text) : async () {
    validateAdminSession(token);
    let entry : Newspaper = {
      id = nextNewspaperId;
      date;
      link;
    };
    newspapers.add(nextNewspaperId, entry);
    nextNewspaperId += 1;
  };

  public shared ({ caller }) func deleteNewspaper(token : Text, id : Nat) : async () {
    validateAdminSession(token);
    newspapers.remove(id);
  };

  // STUDENT PROFILE MANAGEMENT (student session required) ──────

  public query ({ caller }) func getStudentProfile(token : Text) : async ?Student {
    let studentSession = validateStudentSession(token);
    students.get(studentSession.studentId);
  };

  public shared ({ caller }) func updateStudentProfilePhoto(token : Text, photoBase64 : Text) : async () {
    let studentSession = validateStudentSession(token);
    switch (students.get(studentSession.studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        let updatedStudent = { student with profilePhotoBase64 = ?photoBase64 };
        students.add(student.id, updatedStudent);
      };
    };
  };

  // Admin-only: view all students
  public query ({ caller }) func getStudents(token : Text) : async [Student] {
    validateAdminSession(token);
    students.values().toArray();
  };

  // PUBLIC READ FUNCTIONS ───────────────────────────────────────

  public query ({ caller }) func getTests() : async [Test] {
    tests.values().toArray();
  };

  public query ({ caller }) func getTopRankers() : async [Ranker] {
    rankers.values().toArray().sort();
  };

  // PRIVATE HELPERS ───────────────────────────────────────

  func validateAdminSession(token : Text) {
    switch (adminSessions.get(token)) {
      case (?session) {
        if (Time.now() > session.expiration) {
          Runtime.trap("Session expired");
        };
      };
      case (null) { Runtime.trap("Invalid session token") };
    };
  };

  func validateStudentSession(token : Text) : StudentSession {
    switch (studentSessions.get(token)) {
      case (?session) {
        if (Time.now() > session.expiration) {
          Runtime.trap("Student session expired");
        };
        session;
      };
      case (null) { Runtime.trap("Invalid student session token") };
    };
  };

  func generateToken() : async Text {
    let random = Random.crypto();
    let token = (await* random.nat64()).toText();
    token;
  };

  func reRank() {
    let rankersArray = rankers.values().toArray().sort();
    rankers.clear();
    for (i in Nat.range(0, rankersArray.size())) {
      rankers.add(i + 1, {
        rankersArray[i] with rank = i + 1
      });
    };
  };
};
