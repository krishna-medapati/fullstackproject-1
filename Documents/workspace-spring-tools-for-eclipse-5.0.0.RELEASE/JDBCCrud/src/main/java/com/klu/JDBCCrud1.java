package com.klu;

import java.sql.*;
import java.util.Scanner;

public class JDBCCrud1{

    static String url = "jdbc:mysql://localhost:3306/fsads3";
    static String user = "root";
    static String password = "root";
    static Scanner sc = new Scanner(System.in);

    public static void main(String[] args) {

        createTables();
        int choice;

        do {
            System.out.println("\n------ MENU ------");
            System.out.println("1. Insert Department");
            System.out.println("2. Insert Employee");
            System.out.println("3. View Employees");
            System.out.println("4. Update Employee Salary");
            System.out.println("5. Delete Employee");
            System.out.println("6. Exit");
            System.out.print("Enter choice: ");

            choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {
                case 1 -> insertDept();
                case 2 -> insertEmployee();
                case 3 -> viewEmployees();
                case 4 -> updateEmployee();
                case 5 -> deleteEmployee();
                case 6 -> System.out.println("Exiting...");
                default -> System.out.println("Invalid choice!");
            }
        } while (choice != 6);
    }

    static void createTables() {
        try (Connection con = DriverManager.getConnection(url, user, password);
             Statement st = con.createStatement()) {

            String deptTable = """
                CREATE TABLE IF NOT EXISTS dept (
                    dept_id INT PRIMARY KEY AUTO_INCREMENT,
                    dept_name VARCHAR(50) UNIQUE
                )
                """;

            String empTable = """
                CREATE TABLE IF NOT EXISTS employee (
                    emp_id INT PRIMARY KEY,
                    emp_name VARCHAR(50),
                    salary DOUBLE,
                    dept_id INT,
                    FOREIGN KEY (dept_id) REFERENCES dept(dept_id)
                )
                """;

            st.execute(deptTable);
            st.execute(empTable);

            System.out.println("Tables ready.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void insertDept() {
        try (Connection con = DriverManager.getConnection(url, user, password)) {

            String sql = "INSERT INTO dept (dept_name) VALUES (?)";
            PreparedStatement ps = con.prepareStatement(sql);

            System.out.print("Enter Dept Name: ");
            ps.setString(1, sc.nextLine());

            ps.executeUpdate();
            System.out.println("Department inserted!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void insertEmployee() {
        try (Connection con = DriverManager.getConnection(url, user, password)) {

            String sql = "INSERT INTO employee VALUES (?, ?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);

            System.out.print("Enter Emp ID: ");
            ps.setInt(1, sc.nextInt());
            sc.nextLine();

            System.out.print("Enter Emp Name: ");
            ps.setString(2, sc.nextLine());

            System.out.print("Enter Salary: ");
            ps.setDouble(3, sc.nextDouble());

            System.out.print("Enter Dept ID: ");
            ps.setInt(4, sc.nextInt());

            ps.executeUpdate();
            System.out.println("Employee inserted!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void viewEmployees() {
        try (Connection con = DriverManager.getConnection(url, user, password)) {

            String sql = """
                SELECT e.emp_id, e.emp_name, e.salary, d.dept_name
                FROM employee e
                JOIN dept d ON e.dept_id = d.dept_id
                """;

            PreparedStatement ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            System.out.println("\nID | Name | Salary | Department");
            while (rs.next()) {
                System.out.println(
                        rs.getInt(1) + " | " +
                        rs.getString(2) + " | " +
                        rs.getDouble(3) + " | " +
                        rs.getString(4)
                );
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void updateEmployee() {
        try (Connection con = DriverManager.getConnection(url, user, password)) {

            String sql = "UPDATE employee SET salary=? WHERE emp_id=?";
            PreparedStatement ps = con.prepareStatement(sql);

            System.out.print("Enter Emp ID: ");
            int empId = sc.nextInt();

            System.out.print("Enter New Salary: ");
            double salary = sc.nextDouble();

            ps.setDouble(1, salary);
            ps.setInt(2, empId);

            ps.executeUpdate();
            System.out.println("Employee updated!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void deleteEmployee() {
        try (Connection con = DriverManager.getConnection(url, user, password)) {

            String sql = "DELETE FROM employee WHERE emp_id=?";
            PreparedStatement ps = con.prepareStatement(sql);

            System.out.print("Enter Emp ID to delete: ");
            ps.setInt(1, sc.nextInt());

            ps.executeUpdate();
            System.out.println("Employee deleted!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}