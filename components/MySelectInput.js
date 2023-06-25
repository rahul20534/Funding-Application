import { useField } from "formik";

function MySelectInput({ label, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className="col-md-10 ms-5 mt-3">
      <label htmlFor={props.id || props.name} className="form-label">
        {label}
      </label>
      <select
        {...field}
        {...props}
        className={`form-control ${
          meta.touched ? (meta.error ? "is-invalid" : "is-valid") : null
        }`}
      />
      {meta.error && meta.touched ? (
        <div className="invalid-feedback"> {meta.error} </div>
      ) : (
        <div className="valid-feedback"> Looks good! </div>
      )}
    </div>
  );
}

export default MySelectInput;
