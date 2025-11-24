
export const validateSignup = (formData) => {
  let errors = {};

  // First Name
  if (!formData.firstName.trim())
    errors.firstName = "First name is required";

  // Last Name
  if (!formData.lastName.trim())
    errors.lastName = "Last name is required";

  // Email
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  // Password
  if (!formData.password.trim()) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Address
  if (!formData.address?.addressNo?.trim())
    errors.addressNo = "Address number is required";

  if (!formData.address?.city?.trim())
    errors.city = "City is required";

  if (!formData.address?.state?.trim())
    errors.state = "State is required";

  if (!formData.address?.pinNo?.trim()) {
    errors.pinNo = "PIN code is required";
  } else if (!/^\d{6}$/.test(formData.address.pinNo)) {
    errors.pinNo = "PIN must be 6 digits";
  }

  return errors;
};
