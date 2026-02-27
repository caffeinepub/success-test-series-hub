import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  // Old Student type without password field
  type OldStudent = {
    id : Nat;
    mobileNumber : Text;
    otp : ?Text;
    profilePhotoBase64 : ?Text;
    registeredAt : Time.Time;
  };

  // Old state type
  type OldActor = {
    students : Map.Map<Nat, OldStudent>;
  };

  // New Student type with password field
  type NewStudent = {
    id : Nat;
    mobileNumber : Text;
    password : Text;
    otp : ?Text;
    profilePhotoBase64 : ?Text;
    registeredAt : Time.Time;
  };

  type NewActor = {
    students : Map.Map<Nat, NewStudent>;
  };

  public func run(old : OldActor) : NewActor {
    let newStudents = old.students.map<Nat, OldStudent, NewStudent>(
      func(_id, oldStudent) {
        { oldStudent with password = "" };
      }
    );
    { students = newStudents };
  };
};
