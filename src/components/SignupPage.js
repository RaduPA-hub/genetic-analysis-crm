import React, { useState } from 'react';
import * as Yup from 'yup';
import './SignupPage.css';

// Validation schema for signup
const signupValidationSchema = Yup.object().shape({
  f_name: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be no more than 50 characters')
    .matches(/^[A-Za-z\s]+$/, 'First name can only contain letters and spaces'),
  
  l_name: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be no more than 50 characters')
    .matches(/^[A-Za-z\s]+$/, 'Last name can only contain letters and spaces'),
  
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be no more than 100 characters'),
  
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be no more than 100 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  
  center: Yup.string()
    .required('Center is required')
    .min(2, 'Center must be at least 2 characters')
    .max(100, 'Center must be no more than 100 characters'),
  
  address_1: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be no more than 200 characters'),
  
  address_2: Yup.string()
    .max(200, 'Address line 2 must be no more than 200 characters'),
  
  phone_number: Yup.string()
    .required('Phone number is required')
    .matches(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be no more than 20 characters')
});

const SignupPage = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    f_name: '',
    l_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    center: '',
    address_1: '',
    address_2: '',
    phone_number: ''
  });
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = async () => {
    try {
      await signupValidationSchema.validate(formData, { abortEarly: false });
      setValidationErrors({});
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setValidationErrors(newErrors);
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (await validateForm()) {
      setIsSubmitting(true);
      try {
        const { confirmPassword, ...signupData } = formData;
        const resp = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupData)
        });
        const data = await resp.json();
        
        if (!resp.ok || data.status !== 'ok') {
          setErrors(prev => ({ ...prev, general: data.message || 'Signup failed' }));
          return;
        }
        
        // Show success message and redirect to login
        alert('Account created successfully! Please wait for admin validation before logging in.');
        onSwitchToLogin();
      } catch (err) {
        setErrors(prev => ({ ...prev, general: 'Network error. Please try again.' }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <main className="main-content">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <i className="fas fa-user-plus"></i>
            <h2>Create Account</h2>
            <p>Sign up to get started</p>
          </div>
          
          <form className="signup-form" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="error-banner">
                <i className="fas fa-exclamation-circle"></i>
                {errors.general}
              </div>
            )}
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="f_name">First Name</label>
                <div className="input-wrapper">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    id="f_name"
                    name="f_name"
                    value={formData.f_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className={errors.f_name ? 'error' : ''}
                  />
                </div>
                {errors.f_name && <span className="error-message">{errors.f_name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="l_name">Last Name</label>
                <div className="input-wrapper">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    id="l_name"
                    name="l_name"
                    value={formData.l_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className={errors.l_name ? 'error' : ''}
                  />
                </div>
                {errors.l_name && <span className="error-message">{errors.l_name}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={errors.password ? 'error' : ''}
                  />
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="center">Center</label>
              <div className="input-wrapper">
                <i className="fas fa-building"></i>
                <input
                  type="text"
                  id="center"
                  name="center"
                  value={formData.center}
                  onChange={handleChange}
                  placeholder="Enter your center"
                  className={errors.center ? 'error' : ''}
                />
              </div>
              {errors.center && <span className="error-message">{errors.center}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="address_1">Address</label>
              <div className="input-wrapper">
                <i className="fas fa-map-marker-alt"></i>
                <input
                  type="text"
                  id="address_1"
                  name="address_1"
                  value={formData.address_1}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className={errors.address_1 ? 'error' : ''}
                />
              </div>
              {errors.address_1 && <span className="error-message">{errors.address_1}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="address_2">Address Line 2 (Optional)</label>
              <div className="input-wrapper">
                <i className="fas fa-map-marker-alt"></i>
                <input
                  type="text"
                  id="address_2"
                  name="address_2"
                  value={formData.address_2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, etc."
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <div className="input-wrapper">
                <i className="fas fa-phone"></i>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={errors.phone_number ? 'error' : ''}
                />
              </div>
              {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
            </div>
            
            <button type="submit" className="signup-btn" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </form>
          
          <div className="signup-footer">
            <p>Already have an account? <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Sign in</a></p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
