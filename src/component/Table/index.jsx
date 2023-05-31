import React, { useContext, useEffect, useState,useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DataContext } from "../../Home";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import axios from "axios";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CustomizedTables() {
  const {
    data,
    setReload,
    setLoading,
    setOpenModal,
    setOpenNewsModal,
    status,
    setStatus,
    setId,
    newsData,
    setnewsData,
  } = useContext(DataContext);

  const deletedApi = async (id) => {
    setLoading(true);
    await axios
      .delete(
        "https://us-central1-api-test-9bed7.cloudfunctions.net/expressApi/api/users/" +
          id
      )
      .then((res) => {
        if (res?.data) {
          Swal.fire({
            icon: "success",
            title: "ข้อความ.",
            text: "ลบสำเร็จ",
          });
          setReload(Math.floor(Date.now() / 1000));
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "ข้อความ",
          text: "เกิดปัญหากับระบบ",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  

  useEffect(() => {}, [data]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ลับดับที่</StyledTableCell>
              <StyledTableCell align="center">ชื่อ</StyledTableCell>
              <StyledTableCell align="center">นามสกุล</StyledTableCell>
              <StyledTableCell align="center">อายุ</StyledTableCell>
              <StyledTableCell align="center">วันที่</StyledTableCell>
              <StyledTableCell align="center">ลบและแก้ไข</StyledTableCell>
              <StyledTableCell align="center">กล่องข้อความ</StyledTableCell>
              <StyledTableCell align="center">หมายเหตุ</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => (
              <StyledTableRow key={row.index}>
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell align="center">{row.username}</StyledTableCell>
                <StyledTableCell align="center">{row.lastname}</StyledTableCell>
                <StyledTableCell align="center">{row.age}</StyledTableCell>
                <StyledTableCell align="center">
                  {dayjs(row.updated_at)
                    .format("DD/MM/YYYY HH:mm A")
                    .toString()}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "colum",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      sx={{ marginRight: "5px" }}
                      onClick={() => {
                        setOpenModal(true);
                        setStatus("update");
                        setId(row._id);
                      }}
                    >
                      แก้ไขข้อมูล
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ marginLeft: "5px" }}
                      onClick={() => {
                        deletedApi(row._id);
                      }}
                    >
                      ลบข้อมูล
                    </Button>
                  </Box>
                </StyledTableCell>
                <StyledTableCell align="center">{row.message}</StyledTableCell>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "colum",
                    justifyContent: "center",
                  }}
                >
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      sx={{ marginLeft: "5px" }}
                      onClick={() => {
                        setStatus("comment");
                        setOpenNewsModal(true);
                        setId(row._id)
                      }}
                    >
                      เพิ่มความคิดเห็น
                    </Button>
                  </StyledTableCell>
                </Box>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
