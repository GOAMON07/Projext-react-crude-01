import React, { useState, useEffect, useContext, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DataContext } from "../../../Home";
import { Formik, useFormik } from "formik";
import Grid from "@mui/material/Grid";
import axios from "axios";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const initialValues = {
  username: "",
  lastname: "",
  age: "",
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required("กรุณาป้อนชื่อ"),
  lastname: Yup.string().required("กรุณาป้อนนามสกุล"),
  age: Yup.number().required("กรุณาป้อนอายุ").positive().integer(),
});

export default function BasicModal() {
  const [dataDetail, setDataDetail] = useState([]);

  const {
    setReload,
    openModal,
    setOpenModal,
    status,
    setStatus,
    setLoading,
    id,
  } = useContext(DataContext);

  const addData = useCallback(async (username, lastname, age) => {
    setLoading(true);
    await axios
      .post(
        "https://us-central1-api-test-9bed7.cloudfunctions.net/expressApi/api/users",
        [{ username: username, lastname: lastname, age: age,message:"" }]
      )
      .then((res) => {
        if (res?.data) {
          Swal.fire({
            icon: "success",
            title: "ข้อความ",
            text: "สร้างสำเร็จ!",
          });
          setReload(Math.floor(Date.now() / 1000));
          setOpenModal(false);
        }
      })
      .catch((er) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (status === "update") {
        updateData(values.username, values.lastname, values.age);
      } else {
        addData(values.username, values.lastname, values.age);
      }
    },
  });

  const callApiDetail = useCallback(async () => {
    setLoading(true);
    await axios
      .get(
        `https://us-central1-api-test-9bed7.cloudfunctions.net/expressApi/api/users/${id}`
        //+id
      )
      .then((res) => {
        if (res?.data) {
          setDataDetail(res?.data);
          setReload(Math.floor(Date.now() / 1000));
        }
      })
      .catch((er) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (status === "update") {
      callApiDetail();
    }
  }, [status, id]);

  useEffect(() => {
    if (status === "update" && dataDetail) {
      if (formik) {
        formik.setFieldValue("username", dataDetail?.username);
        formik.setFieldValue("lastname", dataDetail?.lastname);
        formik.setFieldValue("age", dataDetail?.age);
      }
    }
  }, [dataDetail]);

  const updateData = useCallback(
    async (username, lastname, age) => {
      setLoading(true);
      await axios
        .put(
          "https://us-central1-api-test-9bed7.cloudfunctions.net/expressApi/api/users/" +
            id,
          { username: username, lastname: lastname, age: age }
        )
        .then((res) => {
          if (res?.data) {
            Swal.fire({
              icon: "success",
              title: "ข้อความ",
              text: "อัพเดทสำเร็จ!",
            });
            setReload(Math.floor(Date.now() / 1000));
            setOpenModal(false);
          }
        })
        .catch((er) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [id]
  );

  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {status === "create" ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="username"
                  variant="outlined"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  fullWidth={true}
                />
                {formik?.touched.username && formik?.errors.username && (
                  <Typography
                    variant="p"
                    sx={{ color: "red", fontSize: "12px" }}
                  >
                    {formik?.errors.username}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="lastname"
                  variant="outlined"
                  name="lastname"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  fullWidth={true}
                />
                {formik?.touched.lastname && formik?.errors.lastname && (
                  <Typography
                    variant="p"
                    sx={{ color: "red", fontSize: "12px" }}
                  >
                    {formik?.errors.lastname}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="age"
                  variant="outlined"
                  type="number"
                  name="age"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  fullWidth={true}
                />
                {formik?.touched.age && formik?.errors.age && (
                  <Typography
                    variant="p"
                    sx={{ color: "red", fontSize: "12px" }}
                  >
                    {formik?.errors.age}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row ",
                  }}
                >
                  <Button
                    size="small"
                    color="inherit"
                    variant="contained"
                    fullWidth
                    sx={{ marginRight: "30px" }}
                    onClick={() => {
                      setOpenModal(false);
                    }}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    fullWidth
                    type="submit"
                  >
                    ตกลง
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
