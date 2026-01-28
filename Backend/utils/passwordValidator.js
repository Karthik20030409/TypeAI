exports.isStrongPassword = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
  
    return (
      password.length >= 8 &&
      hasUpper &&
      hasLower &&
      hasNumber &&
      hasSpecial
    );
  };
  