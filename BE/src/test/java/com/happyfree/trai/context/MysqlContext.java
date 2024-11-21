// package com.happyfree.trai.context;
//
// import org.springframework.test.context.DynamicPropertyRegistry;
// import org.springframework.test.context.DynamicPropertySource;
// import org.testcontainers.containers.MySQLContainer;
// import org.testcontainers.junit.jupiter.Container;
// import org.testcontainers.junit.jupiter.Testcontainers;
//
// @Testcontainers
// public class MysqlContext {
// 	@Container
// 	private static final MySQLContainer<?> mysqlContainer = new MySQLContainer<>("mysql:8.0")
// 		.withDatabaseName("testdb")
// 		.withUsername("testuser")
// 		.withPassword("testpassword");
//
// 	@DynamicPropertySource
// 	static void configureTestDatabase(DynamicPropertyRegistry registry) {
// 		registry.add("spring.datasource.url", mysqlContainer::getJdbcUrl);
// 		registry.add("spring.datasource.username", mysqlContainer::getUsername);
// 		registry.add("spring.datasource.password", mysqlContainer::getPassword);
// 		registry.add("spring.datasource.driver-class-name", () -> "com.mysql.cj.jdbc.Driver");
// 	}
// }
