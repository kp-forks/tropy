CREATE TABLE migrations (
  number      INTEGER  NOT NULL PRIMARY KEY,
  created     NUMERIC  NOT NULL DEFAULT CURRENT_TIMESTAMP
) WITHOUT ROWID;

INSERT INTO migrations (number) VALUES
  (1705231122),
  (1705231144),
  (1708281429),
  (1710212032),
  (1710241005),
  (1710241031),
  (1710241557),
  (1710272322),
  (1712071218),
  (1802091124),
  (1802121029),
  (1802121134),
  (1902151236),
  (1902151256),
  (1902202156),
  (1902202219),
  (1903011734),
  (1903021759),
  (1908091209),
  (1908171112),
  (1908171113),
  (1909102030),
  (1912052116),
  (2101190917);

-- Freeze user_version for backwards compatibility
PRAGMA user_version = 2112312400;
