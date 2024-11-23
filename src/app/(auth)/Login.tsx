import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Field, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React from "react";
import * as yup from "yup";
const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});
function Login() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.refreshToken);
      // You might want to redirect here or update your auth state
      router.replace("/dashboard/articles");
      enqueueSnackbar("Login successful", { variant: "success" });
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "97vh",
        width: "100%",
        backgroundColor: "white",
      }}
    >
      <Image
        src="/logo.png"
        alt="logo"
        width={100}
        height={100}
        style={{ borderRadius: "50%", marginBottom: 8, objectFit: "contain" }}
      />
      <Paper
        sx={{ padding: { xs: 2, md: 4 }, width: { xs: "75%", md: "25%" } }}
      >
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Login
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <FormControl
                    sx={{ m: 1 }}
                    variant="standard"
                    error={formik.touched.email && Boolean(formik.errors.email)}
                  >
                    <InputLabel
                      htmlFor="standard-adornment-email"
                      sx={{
                        padding: "4px",
                      }}
                    >
                      Email
                    </InputLabel>
                    <Field
                      as={Input}
                      variant="standard"
                      name="email"
                      type="email"
                      label="Email"
                      sx={{
                        "& .MuiInput-input": {
                          height: "20px",
                          padding: "8px 4px",
                        },
                      }}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <FormHelperText>{formik.errors.email}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl
                    sx={{ m: 1 }}
                    variant="standard"
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                  >
                    <InputLabel
                      htmlFor="standard-adornment-password"
                      sx={{
                        padding: "4px",
                      }}
                    >
                      Password
                    </InputLabel>
                    <Input
                      id="standard-adornment-password"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {formik.touched.password && formik.errors.password && (
                      <FormHelperText>{formik.errors.password}</FormHelperText>
                    )}
                  </FormControl>
                  <Button variant="contained" type="submit">
                    Login
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Login;
