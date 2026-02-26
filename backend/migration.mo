import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {
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

  type AdminSession = {
    token : Text;
    expiration : Int;
  };

  type OldActor = {
    tests : Map.Map<Nat, Test>;
    contactSubmissions : Map.Map<Nat, ContactSubmission>;
    adminSessions : Map.Map<Text, AdminSession>;
    adminPasswordHash : Map.Map<Text, Text>;
    rankers : Map.Map<Nat, Ranker>;
    nextContactId : Nat;
    nextRankId : Nat;
  };

  type NewActor = {
    tests : Map.Map<Nat, Test>;
    contactSubmissions : Map.Map<Nat, ContactSubmission>;
    adminSessions : Map.Map<Text, AdminSession>;
    rankers : Map.Map<Nat, Ranker>;
    nextContactId : Nat;
    nextRankId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      tests = old.tests;
      contactSubmissions = old.contactSubmissions;
      adminSessions = old.adminSessions;
      rankers = old.rankers;
      nextContactId = old.nextContactId;
      nextRankId = old.nextRankId;
    };
  };
};
