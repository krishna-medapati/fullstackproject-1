package com.klu;

import java.sql.*;

public class JDBCCrud {

    public static void main(String[] args) {

        String url = "jdbc:mysql://localhost:3306/fsads3";
        String usr = "root";
        String pwd = "root";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            Connection con = DriverManager.getConnection(url, usr, pwd);
            System.out.println("Database Connection Established");

            Statement st = con.createStatement();

            // Dept Table
            String createDept =
                    "CREATE TABLE IF NOT EXISTS Dept (" +
                    "dept_id INT PRIMARY KEY AUTO_INCREMENT, " +
                    "dept_name VARCHAR(20))";
            st.execute(createDept);
            System.out.println("Department table created");

            // Emp Table
            String createEmp =
                    "CREATE TABLE IF NOT EXISTS Emp (" +
                    "emp_id INT PRIMARY KEY AUTO_INCREMENT, " +
                    "emp_name VARCHAR(50), " +
                    "sal DOUBLE, " +
                    "dept_id INT, " +
                    "FOREIGN KEY (dept_id) REFERENCES Dept(dept_id))";
            st.execute(createEmp);
            System.out.println("Employee table created");

            // Insert into Dept
            st.executeUpdate("INSERT INTO Dept(dept_name) VALUES('CSE')");
            System.out.println("Dept record inserted");

            // Insert into Emp
            st.executeUpdate(
                    "INSERT INTO Emp(emp_name, sal, dept_id) " +
                    "VALUES('Sridevi', 25000, 1)");
            System.out.println("Emp record inserted");

            st.close();
            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
