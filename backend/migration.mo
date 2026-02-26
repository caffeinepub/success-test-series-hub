import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Time "mo:core/Time";

module {
  type OldTest = {
    id : Nat;
    title : Text;
    category : Text;
    questions : [Question];
    price : Nat;
  };

  type NewTest = {
    id : Nat;
    title : Text;
    category : Text;
    questions : [Question];
    price : Nat;
    negativeMarkValue : Float;
  };

  type Question = {
    question : Text;
    options : [Text];
    answer : Text;
    explanation : ?Text;
    questionHi : ?Text;
    optionsHi : ?[Text];
    explanationHi : ?Text;
  };

  type OldStudent = {
    id : Nat;
    username : Text;
    passwordHash : Text;
    email : Text;
    registeredAt : Time.Time;
  };

  type NewStudent = {
    id : Nat;
    mobileNumber : Text;
    otp : ?Text;
    profilePhotoBase64 : ?Text;
    registeredAt : Time.Time;
  };

  type OldActor = {
    tests : Map.Map<Nat, OldTest>;
    contactSubmissions : Map.Map<Nat, ContactSubmission>;
    adminSessions : Map.Map<Text, AdminSession>;
    students : Map.Map<Nat, OldStudent>;
    studentSessions : Map.Map<Text, StudentSession>;
  };

  type NewActor = {
    tests : Map.Map<Nat, NewTest>;
    contactSubmissions : Map.Map<Nat, ContactSubmission>;
    adminSessions : Map.Map<Text, AdminSession>;
    students : Map.Map<Nat, NewStudent>;
    studentSessions : Map.Map<Text, StudentSession>;
    sliders : Map.Map<Nat, Slider>;
    currentAffairs : Map.Map<Nat, CurrentAffairs>;
    newspapers : Map.Map<Nat, Newspaper>;
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

  type ContactSubmission = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  type AdminSession = {
    token : Text;
    expiration : Int;
  };

  type StudentSession = {
    token : Text;
    studentId : Nat;
    expiration : Int;
  };

  public func run(old : OldActor) : NewActor {
    // Map old tests to include a default negativeMarkValue
    let newTests = old.tests.map<Nat, OldTest, NewTest>(
      func(_id, oldTest) {
        { oldTest with negativeMarkValue = 0.0 };
      }
    );

    // Map old students to new students
    let newStudents = old.students.map<Nat, OldStudent, NewStudent>(
      func(_id, oldStudent) {
        {
          oldStudent with
          mobileNumber = oldStudent.email;
          otp = null;
          profilePhotoBase64 = null;
        };
      }
    );

    // Initialize empty maps for new variables
    {
      old with
      tests = newTests;
      students = newStudents;
      sliders = Map.empty<Nat, Slider>();
      currentAffairs = Map.empty<Nat, CurrentAffairs>();
      newspapers = Map.empty<Nat, Newspaper>();
    };
  };
};
