import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";

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

  type NewActor = {
    tests : Map.Map<Nat, Test>;
    contactSubmissions : Map.Map<Nat, ContactSubmission>;
    rankers : Map.Map<Nat, Ranker>;
  };

  type OldActor = {
    tests : Map.Map<Nat, Test>;
    contactSubmissions : Map.Map<Nat, ContactSubmission>;
    rankers : [Ranker];
  };

  public func run(old : OldActor) : NewActor {
    let newRankers = Map.empty<Nat, Ranker>();
    for (i in Nat.range(0, old.rankers.size())) {
      newRankers.add(i + 1, old.rankers[i]);
    };
    {
      old with
      rankers = newRankers
    };
  };
};
