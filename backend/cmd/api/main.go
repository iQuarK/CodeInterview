package main

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

const dbFileName = "assets.db"

func main() {
	db, err := sql.Open("sqlite3", dbFileName)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	router := gin.Default()

	router.GET("/assets", func(c *gin.Context) {
		pNumber := c.DefaultQuery("pageNumber", "1")
		pSize := c.DefaultQuery("pageSize", "10")
		host := c.Query("host")

		pageNumber, err := strconv.Atoi(pNumber)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		pageSize, err := strconv.Atoi(pSize)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		print("pageNumber", pageNumber)

		print("pageSize", pageSize)
		var rows *sql.Rows
		if host != "" {
			rows, err = db.Query("SELECT id, host, comment, ip, owner FROM assets WHERE host LIKE ? LIMIT ? OFFSET ?", "%"+host+"%", pageSize, (pageNumber-1)*pageSize)
		} else {
			rows, err = db.Query("SELECT id, host, comment, ip, owner FROM assets LIMIT ? OFFSET ?", pageSize, (pageNumber-1)*pageSize)
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var assets []map[string]interface{}
		for rows.Next() {
			var id int
			var host, comment, ip, owner string
			if err := rows.Scan(&id, &host, &comment, &ip, &owner); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			assets = append(assets, map[string]interface{}{
				"id":      id,
				"host":    host,
				"comment": comment,
				"ip":      ip,
				"owner":   owner,
			})
		}

		c.JSON(http.StatusOK, assets)
	})

	router.GET("/assets/count", func(c *gin.Context) {
		var count int
		err := db.QueryRow("SELECT COUNT(*) FROM assets").Scan(&count)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"count": count})
	})

	router.Run(":8080")
}
