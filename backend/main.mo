import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Random "mo:core/Random";
import Migration "migration";
import Principal "mo:core/Principal";

(with migration = Migration.run)
actor {
  type Question = {
    question : Text;
    options : [Text];
    answer : Text;
  };

  type Test = {
    id : Nat;
    title : Text;
    category : Text;
    questions : [Question];
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

  type AdminSession = {
    token : Text;
    expiration : Int;
  };

  let tests = Map.empty<Nat, Test>();
  let contactSubmissions = Map.empty<Nat, ContactSubmission>();
  let adminSessions = Map.empty<Text, AdminSession>();
  let adminPasswordHash = Map.singleton("admin", "password");
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
  var nextContactId = 1;
  var nextRankId = 11;

  // Authentication methods
  public shared ({ caller }) func login(username : Text, password : Text) : async Text {
    switch (adminPasswordHash.get(username)) {
      case (?storedPassword) {
        if (storedPassword == password) {
          let token = await generateToken();
          let session : AdminSession = {
            token;
            expiration = Time.now() + 3600_000_000_000; // 1 hour
          };
          adminSessions.add(token, session);
          return token;
        } else {
          Runtime.trap("Invalid username or password");
        };
      };
      case (null) {
        Runtime.trap("Invalid username or password");
      };
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

  // CRUD Operations for Tests
  public shared ({ caller }) func addTest(token : Text, title : Text, category : Text, questions : [Question]) : async () {
    validateAdminSession(token);
    let id = tests.size() + 1;
    let test : Test = {
      id;
      title;
      category;
      questions;
    };
    tests.add(id, test);
  };

  public shared ({ caller }) func updateTest(token : Text, id : Nat, title : Text, category : Text, questions : [Question]) : async () {
    validateAdminSession(token);
    let test : Test = {
      id;
      title;
      category;
      questions;
    };
    tests.add(id, test);
  };

  public shared ({ caller }) func deleteTest(token : Text, id : Nat) : async () {
    validateAdminSession(token);
    tests.remove(id);
  };

  // Rankers management
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

  // View Contact Submissions
  public query ({ caller }) func getContactSubmissions(token : Text) : async [ContactSubmission] {
    validateAdminSession(token);
    contactSubmissions.values().toArray();
  };

  // User-facing functions
  public query ({ caller }) func getTests() : async [Test] {
    let iter = tests.values();
    iter.toArray();
  };

  public query ({ caller }) func getTestById(id : Nat) : async Test {
    switch (tests.get(id)) {
      case (null) { Runtime.trap("Test not found") };
      case (?test) { test };
    };
  };

  public shared ({ caller }) func generateQuestions(topic : Text, difficulty : Text) : async [Question] {
    let questions = Array.repeat(
      {
        question = "Sample question about " # topic # " (" # difficulty # ")";
        options = ["Option 1", "Option 2", "Option 3", "Option 4"];
        answer = "Option 1";
      },
      5,
    );
    questions;
  };

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

  public query ({ caller }) func getTopRankers() : async [Ranker] {
    rankers.values().toArray().sort();
  };

  public query ({ caller }) func getContactSubmissionsUser() : async [ContactSubmission] {
    contactSubmissions.values().toArray();
  };

  // Helper Functions
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
